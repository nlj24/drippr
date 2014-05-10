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

            window.articlesResults = articlesData;

            var feed = resJSON;

            var templateSource = $("#article-template").html(),
            template = Handlebars.compile(templateSource),
            articleHTML = template({"articles":feed});
            $('#articles').html(articleHTML);

            $(".topCat").css("background", "#6D6E70");
            $('.topCat').css("color", "white");
            $(".topCatImg.grey").attr("class", 'topCatImg catImg grey hide');
            $(".topCatImg.white").attr("class", 'topCatImg catImg white');

            $('.categ').click(function(e){
                var id = $(e.target).parents('.categ').attr("category");
                feed = articlesData[id];
                articleHTML = template({"articles":feed});
                $('#articles').html(articleHTML);
                

                var articleId = window.curArticle;
                console.log(articleId);

                $('.categ').css("background", "white");
                $('.categ').css("color", "#6D6E70");
                $(e.target).parents('.categ').css("background", "#6D6E70");
                $(e.target).parents('.categ').css("color", "white");
                
                $('.white').each(function(){
                    $(this).attr("class", 'catImg white hide');
                });

                $('.grey').each(function(){
                    $(this).attr("class", 'catImg grey');
                });

                $(e.target).parents('.categ').find('.grey').attr("class", 'catImg grey hide');
                $(e.target).parents('.categ').find('.white').attr("class", 'catImg white');
            });
            
            window.likeList = [];
            var internalLike = [];
           	$(".like").click(function(){
                var articleId = window.curArticle;
                console.log(window.chosenFriend);
                if($('.like.grey2').hasClass('hide')) {
                    $("#up").text(--articlesData[articleId].numLikes);
                    $(".like.grey2").attr("class", 'opinion like grey2');
                    $(".like.blue").attr("class", 'opinion like blue hide');
                    $.ajax({
                        url:'http://localhost:5000/removeLikes',
                        data: {user: 1418163097, article: articleId},
                        type:'get'
                    });
                    for(var i=0; i < window.likeList.length; i++){
                        if (articleId === window.likeList[i]) {
                            likeList.splice(likeList.indexOf(articleId),1);
                        }
                    }
                    articlesData[articleId]['userLiked'] = false;
                    return;
                };

                if ($(".dislike.grey2").hasClass("hide")) {
                    $(".dislike.grey2").attr("class", 'opinion dislike grey2');
                    $(".dislike.blue").attr("class", 'opinion dislike blue hide');
                    $("#down").text(--articlesData[articleId].numDislikes);
                    $.ajax({
                        url:'http://localhost:5000/removeDislikes',
                        data: {user: 1418163097, article: articleId},
                        type:'get'
                    });
                    articlesData[articleId]['userLiked'] = false;
                };

                if($('.like.blue').hasClass('hide')) {
                    $("#up").text(++articlesData[articleId].numLikes);
                    $(".like.grey2").attr("class", 'opinion like grey2 hide')
                    $(".like.blue").attr("class", 'opinion like blue');
                    $.ajax({
                        url:'http://localhost:5000/likes',
                        data: {user: 1418163097, article: articleId},
                        type:'get'
                    });
                    internalLike.push(articleId);
                    articlesData[articleId]['userLiked'] = true;
                };
                window.likeList = internalLike;
			});

            console.log(window.likeList);    

			$(".dislike").click(function(){
                var articleId = window.curArticle;

                if($('.dislike.grey2').hasClass('hide')) {
                    $("#down").text(--articlesData[articleId].numDislikes);
                    $(".dislike.grey2").attr("class", 'opinion dislike grey2');
                    $(".dislike.blue").attr("class", 'opinion dislike blue hide');
                    $.ajax({
                        url:'http://localhost:5000/removeDislikes',
                        data: {user: 1418163097, article: articleId},
                        type:'get'
                    });
                    return;
                };

                if ($(".like.grey2").hasClass("hide")) {
                    $(".like.grey2").attr("class", 'opinion like grey2');
                    $(".like.blue").attr("class", 'opinion like blue hide');
                    $("#up").text(--articlesData[articleId].numLikes);
                    $.ajax({
                        url:'http://localhost:5000/removeLikes',
                        data: {user: 1418163097, article: articleId},
                        type:'get'
                    });
                };

                if($('.dislike.blue').hasClass('hide')) {
                    $("#down").text(++articlesData[articleId].numDislikes);
                    $(".dislike.grey2").attr("class", 'opinion dislike grey2 hide');
                    $(".dislike.blue").attr("class", 'opinion dislike blue');
                    $.ajax({
                        url:'http://localhost:5000/dislikes',
                        data: {user: 1418163097, article: articleId},
                        type:'get'
                    });
                };
			});

            $(".dripp").click(function(){
                var articleId = window.curArticle;
                $('#fb-form').modal({
                    fadeDuration: 250,
                    fadeDelay: 1.2
                });
                $('#fb-form').bind("keyup keypress", function(e) {
                    var code = e.keyCode || e.which; 
                    if (code  == 13) {
                        e.preventDefault();
                        return false;
                    }
                });
            });

            $(".readLater").click(function(){
                var articleId = window.curArticle;
                $(".readLater.grey2").attr("class", 'opinion readLater grey2 hide');
                $(".readLater.blue").attr("class", 'opinion readLater blue');
                $.ajax({
                    url:'http://localhost:5000/readItLater',
                    data: {userId: 1418163097, name: "readLater", articleId: articleId, dateAdded: "2014-04-29 17:12:58", bucketId: 2},
                    type:'get'
                });
            });
        },

        loadArticleData : function(){
 
            $.ajax({
                url:'http://localhost:5000/articles',
                data: {user: 1418163097},
                method:'get',
                success:this.handlerData
            });
        },
};
 
$(document).ready(function(){
    ARTICLE_METHOD.loadArticleData();
});

