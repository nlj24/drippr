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
                    articlesData[resJSON[i].id] = resJSON[i];
            }


            var feed = resJSON;

            var templateSource = $("#article-template").html(),
            template = Handlebars.compile(templateSource),
            articleHTML = template({"articles":feed});
            $('#articles').html(articleHTML);
            
            $('.white').each(function(){
                $(this).addClass('display');
            });

            $(".topCat").css("background", "#6D6E70");
            $('.topCat').css("color", "white");
            $(".topCatImg.grey").attr("class", 'topCatImg catImg grey display');
            $(".topCatImg.white").attr("class", 'topCatImg catImg white');

            $('.categ').click(function(e){
                var id = $(e.target).parents('.categ').attr("category");
                feed = articlesData[id];
                articleHTML = template({"articles":feed});
                $('#articles').html(articleHTML);
                $('.categ').css("background", "white");
                $('.categ').css("color", "#6D6E70");
                $(e.target).parents('.categ').css("background", "#6D6E70");
                $(e.target).parents('.categ').css("color", "white");
                
                $('.white').each(function(){
                    $(this).attr("class", 'catImg white display');
                });

                $('.grey').each(function(){
                    $(this).attr("class", 'catImg grey');
                });

                $(e.target).parents('.categ').find('.grey').attr("class", 'catImg grey display');
                $(e.target).parents('.categ').find('.white').attr("class", 'catImg white');
            });
            


           	$(".like").click(function(e){
                var articleId = window.curArticle;
                $("#up").text(++articlesData[articleId].numLikes);

                $.ajax({
                    url:'http://localhost:5000/likes',
                    data: {user: 1, article: articleId},
                    type:'get'
                });
			});

			$(".dislike").click(function(e){
                var articleId = window.curArticle;
                $("#down").text(++articlesData[articleId].numDislikes);

                $.ajax({
                    url:'http://localhost:5000/dislikes',
                    data: {user: 1, article: articleId},
                    type:'get'
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

