
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
			    },
			 
			    goToPrev: function() {
					this.goTo(this.currentIndex - 1);
			    },
			 
			    goToNext: function() {
					this.goTo(this.currentIndex + 1);

				}
			}