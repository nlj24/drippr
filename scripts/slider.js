
var Slider = function() { this.initialize.apply(this, arguments) }
	  		Slider.prototype = {
	 
			    initialize: function(slider) {
					this.ul = slider.children[0];
					this.li = this.ul.children;

					// make <ul> as large as all <li>’s
					this.ul.style.width = (this.li[0].clientWidth * this.li.length) + 'px';

					this.currentIndex = 5;
					window.curArticle = this.li[this.currentIndex].id;
					window.setLikes();
					window.resetFB();
			    },
			 
			    goTo: function(index) {
					// filter invalid indices
					if (index < 0 || index > this.li.length - 1)
					return;

					// move <ul> left
					this.ul.style.left = '-' + (100 * index) + '%';

					this.currentIndex = index;

					window.curArticle = this.li[this.currentIndex].id;
                	var articleId = window.curArticle;
                	window.setLikes();
		            
		            for(var i=0; i < window.readList.length; i++){
		            	if (articleId === window.readList[i]) {
			            	$(".readLater.grey2").attr("class", 'opinionDripp readLater grey2 hide');
			                $(".readLater.blue").attr("class", 'opinionDripp readLater blue');
			            }
		            }
		           	window.resetFB();
			    },
			 	
			    goToPrev: function() {
					this.goTo(this.currentIndex - 1);
			    },
			 
			    goToNext: function() {
					this.goTo(this.currentIndex + 1);

				}
			}

window.setLikes = function correctLikes() {
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
}

window.resetFB = function fbReset() {
	window.chosenFriends = {};
	window.ids=[];
	$('#chosen').empty();
}