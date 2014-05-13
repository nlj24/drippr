
var Slider = function() { this.initialize.apply(this, arguments) }
	  		Slider.prototype = {
	 
			    initialize: function(slider) {
					this.ul = slider.children[0];
					this.li = this.ul.children;

					// make <ul> as large as all <li>’s
					this.ul.style.width = (this.li[0].clientWidth * this.li.length) + 'px';

					this.currentIndex = 0;
					window.curArticle = this.li[this.currentIndex].id; 
					document.getElementById('up').innerHTML =  this.li[this.currentIndex].getAttribute("numlikes");
					document.getElementById('down').innerHTML =  this.li[this.currentIndex].getAttribute("numdislikes");
					var articleId = window.curArticle;
					console.log(articlesResults[articleId]['userLiked']);
					if (articlesResults[articleId]['userLiked']) {
		                $(".like.grey2").attr("class", 'opinionDripp like grey2 hide')
		                $(".like.blue").attr("class", 'opinionDripp like blue');
		            }
		            if (articlesResults[articleId]['userLiked'] === false) {
		                $(".like.grey2").attr("class", 'opinionDripp like grey2')
		                $(".like.blue").attr("class", 'opinionDripp like blue hide');
		            }
		            if (articlesResults[articleId]['userDisliked']) {
		                $(".dislike.grey2").attr("class", 'opinionDripp dislike grey2 hide')
		                $(".dislike.blue").attr("class", 'opinionDripp dislike blue');
		            }
		            if (articlesResults[articleId]['userDisliked'] === false) {
		                $(".dislike.grey2").attr("class", 'opinionDripp dislike grey2')
		                $(".dislike.blue").attr("class", 'opinionDripp dislike blue hide');
		            }
		            window.chosenFriends = {};
					window.ids=[];
					$('#chosen').empty();

					$(document).keydown(function(e){
                        if (e.keyCode == 37) {
                            javascript:sliders[0].goToPrev();
                        }
                        if (e.keyCode == 39) {
                            javascript:sliders[0].goToNext();
                        }
                    });
			    },
			 
			    goTo: function(index) {
					// filter invalid indices
					if (index < 0 || index > this.li.length - 1)
					return;

					// move <ul> left
					this.ul.style.left = '-' + (100 * index) + '%';

					this.currentIndex = index;

					window.curArticle = this.li[this.currentIndex].id; 
					document.getElementById('up').innerHTML =  this.li[this.currentIndex].getAttribute("numlikes");
					document.getElementById('down').innerHTML =  this.li[this.currentIndex].getAttribute("numdislikes");
					$(".grey2").removeClass("hide");
                	$(".blue").addClass("hide");
                	var articleId = window.curArticle;
		            if (articlesResults[articleId]['userLiked']) {
		                $(".like.grey2").attr("class", 'opinionDripp like grey2 hide');
		                $(".like.blue").attr("class", 'opinionDripp like blue');
		            }
		            if (articlesResults[articleId]['userDisliked']) {
		                $(".dislike.grey2").attr("class", 'opinionDripp dislike grey2 hide');
		                $(".dislike.blue").attr("class", 'opinionDripp dislike blue');
		            }

		            for(var i=0; i < window.likeList.length; i++){
		            	if (articleId === window.likeList[i]) {
			            	$(".like.grey2").attr("class", 'opinionDripp like grey2 hide');
			                $(".like.blue").attr("class", 'opinionDripp like blue');
			                $("#up").text(articlesResults[articleId].numLikes);
			            }
		            }
		            for(var i=0; i < window.dislikeList.length; i++){
		            	if (articleId === window.dislikeList[i]) {
			            	$(".dislike.grey2").attr("class", 'opinionDripp dislike grey2 hide');
			                $(".dislike.blue").attr("class", 'opinionDripp dislike blue');
			                $("#down").text(articlesResults[articleId].numDislikes);
			            }
		            }
		            console.log(readList);
		            for(var i=0; i < window.readList.length; i++){
		            	if (articleId === window.readList[i]) {
			            	$(".readLater.grey2").attr("class", 'opinionDripp readLater grey2 hide');
			                $(".readLater.blue").attr("class", 'opinionDripp readLater blue');
			            }
		            }
		            window.chosenFriends = {};
					window.ids=[];
					$('#chosen').empty();
			    },
			 	
			    goToPrev: function() {
					this.goTo(this.currentIndex - 1);
			    },
			 
			    goToNext: function() {
					this.goTo(this.currentIndex + 1);

				}
			}