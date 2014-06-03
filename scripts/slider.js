
var Slider = function() { this.initialize.apply(this, arguments) }
	  		Slider.prototype = {
	 
			    initialize: function(slider) {
					this.ul = slider.children[0];
					this.li = this.ul.children;

					// make <ul> as large as all <li>’s
					this.ul.style.width = (this.li[0].clientWidth * this.li.length) + 'px';

					this.currentIndex = 0;
					window.curArticle = this.li[this.currentIndex].id;
					window.setDrippLikes();
					window.resetFB();
					this.goTo(window.positions[window.curCategory]);
			    },
			 
			    goTo: function(index) {
					// filter invalid indices
					if (index < 0 || index > this.li.length - 1)
					return;

					// move <ul> left
					

					if (this.li.length  - index < 10) {


						this.ul.style.left = '-' + (100 * index) + '%';


	                	window.setDrippLikes();
			            
			           	window.resetFB();


						window.curArticle = this.li[index].id;

						window.positions[window.curCategory] = Math.min(10, index);

						var indexInArray = window.articlesData[window.curCategory].indexOf(window.curArticle);

						var refreshTemplate = function(){
							feed = window.articlesData[window.curCategory].slice(Math.max(0, indexInArray -10),indexInArray + 40);

					        var templateSource = $("#article-template").html(), 
					        template = Handlebars.compile(templateSource),
					        articleHTML = template({"articles":feed});
					        $('#articles').html(articleHTML);

						}

						if ( window.articlesData[window.curCategory].length - indexInArray < 40){
							if (!(window.callingback[window.curCategory])) {
								window.ARTICLE_METHOD.loadArticleDataCategory(window.curCategory, window.curArticle, refreshTemplate);
								
							}

						}
						else{
							refreshTemplate();
						}




					} else{
						this.ul.style.left = '-' + (100 * index) + '%';

						this.currentIndex = index;

						window.curArticle = this.li[this.currentIndex].id;
	                	window.positions[window.curCategory] = index;


	                	window.setDrippLikes();
			            
			           	window.resetFB();
						
					}



			    },
			 	
			    goToPrev: function() {
					this.goTo(this.currentIndex - 1);
			    },
			 
			    goToNext: function() {
					this.goTo(this.currentIndex + 1);

				}
			}

window.setDrippLikes = function correctLikes() {
	if (articlesResults[window.curArticle]['userLiked']) {
        $(".like.grey2").attr("class", 'opinionDripp like grey2 hide')
        $(".like.blue").attr("class", 'opinionDripp like blue');
        $(".up").html(articlesResults[window.curArticle].numLikes);
    }
    if (articlesResults[window.curArticle]['userLiked'] === false) {
        $(".like.grey2").attr("class", 'opinionDripp like grey2')
        $(".like.blue").attr("class", 'opinionDripp like blue hide');
        $(".up").html(articlesResults[window.curArticle].numLikes);
    }
    if (articlesResults[window.curArticle]['userDisliked']) {
        $(".dislike.grey2").attr("class", 'opinionDripp dislike grey2 hide')
        $(".dislike.blue").attr("class", 'opinionDripp dislike blue');
        $(".down").html(articlesResults[window.curArticle].numDislikes);
    }
    if (articlesResults[window.curArticle]['userDisliked'] === false) {
        $(".dislike.grey2").attr("class", 'opinionDripp dislike grey2')
        $(".dislike.blue").attr("class", 'opinionDripp dislike blue hide');
        $(".down").html(articlesResults[window.curArticle].numDislikes);
    }
    if (articlesResults[window.curArticle]['userReadItLater']) {
        $(".readLater.grey2").attr("class", 'opinionDripp readLater grey2 hide')
        $(".readLater.blue").attr("class", 'opinionDripp readLater blue');
    }
    if (articlesResults[window.curArticle]['userReadItLater'] === false) {
        $(".readLater.grey2").attr("class", 'opinionDripp readLater grey2')
        $(".readLater.blue").attr("class", 'opinionDripp readLater blue hide');
    }
    $(".dripp").attr("class", 'opinionDripp dripp');
}

window.resetFB = function fbReset() {
	window.chosenFriends = {};
	window.ids=[];
	$('#chosen').empty();
}