var article_results;

var ARTICLE_METHOD ={

 
        handlerData:function(resJSON){
            article_results = resJSON;
            console.log(resJSON);


            var articlesData = {};
            articlesData["All"] = [];
            var cat;

            for (var i=0;i<resJSON.length;i++) {
                cat = resJSON[i].category;
                if(!(cat in articlesData)){
                    articlesData[cat] = [];
                }
                    articlesData[cat].push(resJSON[i]);
                    articlesData["All"].push(resJSON[i]);
            }

            var feed = resJSON;

            var templateSource = $("#article-template").html(),
            template = Handlebars.compile(templateSource),
            articleHTML = template({"articles":feed});
            $('#articles').html(articleHTML);

            $(".topCat").css("background", "#82C6ED");

            $('.categ').click(function(e){
                 //get category based on what you clicked
                 
                 
                 //get feed based on category
                 var id = $(e.target).parents('.categ').attr("category");
                 feed = articlesData[id];
                 articleHTML = template({"articles":feed});
                 $('#articles').html(articleHTML);
        
                 $('.categ').css("background", "white");
                 $(e.target).parents('.categ').css("background", "#82C6ED");


            });

            // $("#all").click(function(){
            //     feed = resJSON;
            //     articleHTML = template({"articles":feed});
            //     $('#articles').html(articleHTML);
            //     document.getElementById("all").style.background="#82C6ED";
            // });

            // $("#world").click(function(){
            //     feed = world;
            //     articleHTML = template({"articles":feed});
            //     $('#articles').html(articleHTML);
            //     document.getElementById("world").style.background="#82C6ED";
            // });

            
           
           	$(".like").click(function(e){
			// e.preventDefault();
                var articleId = $(e.target).attr("article");
                console.log("article results...");
                console.log(article_results);
				console.log(articleId);

                $.ajax({
                    url:'http://localhost:5000/likes',
                    data: {user: 1, article: articleId},
                    type:'get',
                    success:function(){
                        console.log('it worked?');
                    }
                });
			});

			$(".dislike").click(function(e){
			// e.preventDefault();
				var articleId = $(e.target).attr("article");
                console.log($(e.target).attr("article"));

                $.ajax({
                    url:'http://localhost:5000/dislikes',
                    data: {user: 1, article: articleId},
                    type:'get',
                    success:function(){
                        console.log('it dis worked?');
                    }
                });
			});

            $(".dripp").click(function(e){
            // e.preventDefault();
                alert("add ability to send");
                //ajax request to add this like, if the user hasn't liked it before
            });

            $(".readLater").click(function(e){
            // e.preventDefault();
                alert("add ability to read later");
                //ajax request to add this like, if the user hasn't liked it before
            });
             
        },

        loadArticleData : function(){
 
            $.ajax({
                // url:'json/articles.json',
                url:'http://localhost:5000/articles',
                data: {user: 1},
                method:'get',
                success:this.handlerData
            });
        },
};
 
$(document).ready(function(){
    ARTICLE_METHOD.loadArticleData();
});

