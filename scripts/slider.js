
var Slider = function() { this.initialize.apply(this, arguments) }
	  		
	Slider.prototype = {

    initialize: function(slider) {
		this.ul = slider.children[0];
		this.li = this.ul.children;

		this.ul.style.width = (Math.ceil($(window).width() * 7/12) * this.li.length) + 'px';
		this.currentIndex = 0;
		window.curArticle = this.li[this.currentIndex].id;
		
		window.setDrippLikes();
		window.resetFB();
		$('#sliderPad').height($(window).height()-230);
		$('.mainBubble').width($(".slider").width());
		$('.mainBubble').height($(".slider").height());
		$('.imageDivDripp').height($(".slider").height()-87);
		$('.imageDivDripp').css('line-height',($(".slider").height()-87)+"px");
		$('.fitimageDripp').css('max-width',.9*$(".slider").width());
		$('.fitimageDripp').css('max-height',.85*($(".slider").height()-67));
		if (window.curArticlePosition2[window.curCategory] == undefined){
			window.curArticlePosition2[window.curCategory] = window.curArticle;
		}
		var artPosID = window.curArticlePosition2[window.curCategory];
		this.goTo(window.curArticlePosition[window.curCategory][artPosID]);
    },
 
    goTo: function(index) {

		if (index < 0 || index > this.li.length - 1)
		return;
		
		this.ul.style.left = '-' + (100 * index) + '%';

		this.currentIndex = index;

		window.curArticle = this.li[this.currentIndex].id;
    	window.positions[window.curCategory] = index;
    	window.curArticlePosition2[window.curCategory] = window.curArticle;

    	window.setDrippLikes();
        
       	window.resetFB();

		if (this.li.length  - index < 10) {
			if (!(window.callingback[window.curCategory])) {

				var indexInArray = index;
				
				for (var ii = index; ii <  window.articlesData[window.curCategory].length; ii++) {
					if(window.articlesData[window.curCategory][ii].id == window.curArticle){
						indexInArray = ii;
						break;
					}	
				}
										
				var refreshTemplate = function(index, indexInArray2){

					window.positions[window.curCategory] = Math.min(10, index);
			        window.feed = window.articlesData[window.curCategory].slice(Math.max(0, indexInArray -10),indexInArray + 50);
			        for (var ii = 0; ii < feed.length; ii++){
		                window.curArticlePosition[window.curCategory][feed[ii].id] = ii;
		            }
			        var templateSource = $("#article-template").html(), 
			        template = Handlebars.compile(templateSource),
			        articleHTML = template({"articles":window.feed});
			        $('#articles').html(articleHTML);
				}

				if ( window.articlesData[window.curCategory].length - indexInArray < 40){
					if (!(window.callingback[window.curCategory])) {
						window.ARTICLE_METHOD.loadArticleDataCategory(window.curCategory, window.articlesData[window.curCategory][window.articlesData[window.curCategory].length -1].id, index, indexInArray, refreshTemplate);
					}

				}
				else{
					refreshTemplate(index, indexInArray);
				}
			}
		}
    },
 	
    goToPrev: function() {
		this.goTo(this.currentIndex - 1);
		if (window.curArticlePosition3 > 0) {
			window.curArticlePosition3[window.curCategory] -= 1;
		}
    },
 
    goToNext: function() {
    	if ((window.curArticle == window.articlesData[window.curCategory][window.articlesData[window.curCategory].length-1].id) && (window.articlesReceived[window.curCategory] == 0)) {
            $('#noMoreDripps').modal('show');
            setTimeout(function() {
                $('#noMoreDripps').modal('hide');
            }, 3500);
        } else {
			this.goTo(this.currentIndex + 1);
			window.curArticlePosition3[window.curCategory] += 1;
		}
	}
}

window.setDrippLikes = function correctLikes() {
	if (window.articlesData[window.curArticle]['userLiked']) {
        $(".like.grey2").attr("class", 'opinionDripp like grey2 hide')
        $(".like.blue").attr("class", 'opinionDripp like blue');
        $(".up").html(window.articlesData[window.curArticle].numLikes);
    }
    if (window.articlesData[window.curArticle]['userLiked'] === false) {
        $(".like.grey2").attr("class", 'opinionDripp like grey2')
        $(".like.blue").attr("class", 'opinionDripp like blue hide');
        $(".up").html(window.articlesData[window.curArticle].numLikes);
    }
    if (window.articlesData[window.curArticle]['userDisliked']) {
        $(".dislike.grey2").attr("class", 'opinionDripp dislike grey2 hide')
        $(".dislike.blue").attr("class", 'opinionDripp dislike blue');
        $(".down").html(window.articlesData[window.curArticle].numDislikes);
    }
    if (window.articlesData[window.curArticle]['userDisliked'] === false) {
        $(".dislike.grey2").attr("class", 'opinionDripp dislike grey2')
        $(".dislike.blue").attr("class", 'opinionDripp dislike blue hide');
        $(".down").html(window.articlesData[window.curArticle].numDislikes);
    }
    if (window.articlesData[window.curArticle]['userReadItLater']) {
        $(".readLater.grey2").attr("class", 'opinionDripp readLater grey2 hide')
        $(".readLater.blue").attr("class", 'opinionDripp readLater blue');
    }
    if (window.articlesData[window.curArticle]['userReadItLater'] === false) {
        $(".readLater.grey2").attr("class", 'opinionDripp readLater grey2')
        $(".readLater.blue").attr("class", 'opinionDripp readLater blue hide');
    }
    $(".dripp").attr("class", 'opinionDripp dripp');
}

window.resetFB = function fbReset() {
	window.drippsChosenFriends = {};
	window.drippsIds=[];
	$('#chosen').empty();
    window.autoCompleteGroups = window.groupList;
    window.selGroups = [];
}