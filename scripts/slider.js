
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
		                $(".like.grey2").attr("class", 'opinion like grey2 hide')
		                $(".like.blue").attr("class", 'opinion like blue');
		            }
		            if (articlesResults[articleId]['userLiked'] === false) {
		                $(".like.grey2").attr("class", 'opinion like grey2')
		                $(".like.blue").attr("class", 'opinion like blue hide');
		            }
		            if (articlesResults[articleId]['userDisliked']) {
		                $(".dislike.grey2").attr("class", 'opinion dislike grey2 hide')
		                $(".dislike.blue").attr("class", 'opinion dislike blue');
		            }
		            if (articlesResults[articleId]['userDisliked'] === false) {
		                $(".dislike.grey2").attr("class", 'opinion dislike grey2')
		                $(".dislike.blue").attr("class", 'opinion dislike blue hide');
		            }
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
		                $(".like.grey2").attr("class", 'opinion like grey2 hide')
		                $(".like.blue").attr("class", 'opinion like blue');
		            }
		            if (articlesResults[articleId]['userDisliked']) {
		                $(".dislike.grey2").attr("class", 'opinion dislike grey2 hide')
		                $(".dislike.blue").attr("class", 'opinion dislike blue');
		            }

		            console.log(window.likeList);
		            for(var i=0; i < window.likeList.length; i++){
		            	if (articleId === window.likeList[i]) {
			            	$(".like.grey2").attr("class", 'opinion like grey2 hide')
			                $(".like.blue").attr("class", 'opinion like blue');
			                $("#up").text(articlesResults[articleId].numLikes);
			            }
		            } 
			    },
			 
			    goToPrev: function() {
					this.goTo(this.currentIndex - 1);
			    },
			 
			    goToNext: function() {
					this.goTo(this.currentIndex + 1);

				}
			}