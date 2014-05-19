var article_results;

window.ARTICLE_METHOD ={

        handlerData:function(resJSON){
            article_results = resJSON;

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

            $(".drippsBub").click(function(){
                window.setLikes();
                $("#buckets").attr("class", "container-fluid hide");
                $("#bucketsHeader").attr("class", "col-md-5 headingPad hide");
                $("#dripps").attr("class", "container-fluid");
                $("#drippsHeader").attr("class", "col-md-5 headingPad");
                $("#groups").attr("class", "container-fluid hide");
                $("#groupsHeader").attr("class", "col-md-5 headingPad hide");
            });

            $(".groupsBub").click(function(){
                $("#buckets").attr("class", "container-fluid hide");
                $("#bucketsHeader").attr("class", "col-md-5 headingPad hide");
                $("#dripps").attr("class", "container-fluid hide");
                $("#drippsHeader").attr("class", "col-md-5 headingPad hide");
                $("#groups").attr("class", "container-fluid");
                $("#groupsHeader").attr("class", "col-md-5 headingPad");
            });

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
            
           	$(".like").click(function(){
                var articleId = window.curArticle;
                if($('.like.grey2').hasClass('hide')) {
                    $(".up").text(--articlesData[articleId].numLikes);
                    $(".like.grey2").attr("class", 'opinionDripp like grey2');
                    $(".like.blue").attr("class", 'opinionDripp like blue hide');
                    $.ajax({
                        url:'http://localhost:5000/removeLikes',
                        data: {user: window.myID, article: articleId},
                        type:'get'
                    });
                    articlesData[articleId]['userLiked'] = false;
                    return;
                };

                if ($(".dislike.grey2").hasClass("hide")) {
                    $(".dislike.grey2").attr("class", 'opinionDripp dislike grey2');
                    $(".dislike.blue").attr("class", 'opinionDripp dislike blue hide');
                    $(".down").text(--articlesData[articleId].numDislikes);
                    $.ajax({
                        url:'http://localhost:5000/removeDislikes',
                        data: {user: window.myID, article: articleId},
                        type:'get'
                    });
                    articlesData[articleId]['userLiked'] = true;
                    articlesData[articleId]['userDisliked'] = false;                
                };
                if($('.like.blue').hasClass('hide')) {
                    $(".up").text(++articlesData[articleId].numLikes);
                    $(".like.grey2").attr("class", 'opinionDripp like grey2 hide')
                    $(".like.blue").attr("class", 'opinionDripp like blue');
                    $.ajax({
                        url:'http://localhost:5000/likes',
                        data: {user: window.myID, article: articleId},
                        type:'get'
                    });
                    articlesData[articleId]['userLiked'] = true;
                };
			});

			$(".dislike").click(function(){
                var articleId = window.curArticle;
                if($('.dislike.grey2').hasClass('hide')) {
                    $(".down").text(--articlesData[articleId].numDislikes);
                    $(".dislike.grey2").attr("class", 'opinionDripp dislike grey2');
                    $(".dislike.blue").attr("class", 'opinionDripp dislike blue hide');
                    $.ajax({
                        url:'http://localhost:5000/removeDislikes',
                        data: {user: window.myID, article: articleId},
                        type:'get'
                    }); 
                    articlesData[articleId]['userDisliked'] = false;
                    return;
                };

                if ($(".like.grey2").hasClass("hide")) {
                    $(".like.grey2").attr("class", 'opinionDripp like grey2');
                    $(".like.blue").attr("class", 'opinionDripp like blue hide');
                    $(".up").text(--articlesData[articleId].numLikes);
                    $.ajax({
                        url:'http://localhost:5000/removeLikes',
                        data: {user: window.myID, article: articleId},
                        type:'get'
                    });
                    articlesData[articleId]['userLiked'] = false;
                    articlesData[articleId]['userDisliked'] = true;
                };

                if($('.dislike.blue').hasClass('hide')) {
                    $(".down").text(++articlesData[articleId].numDislikes);
                    $(".dislike.grey2").attr("class", 'opinionDripp dislike grey2 hide');
                    $(".dislike.blue").attr("class", 'opinionDripp dislike blue');
                    $.ajax({
                        url:'http://localhost:5000/dislikes',
                        data: {user: window.myID, article: articleId},
                        type:'get'
                    });
                    articlesData[articleId]['userDisliked'] = true;
                };
			});

            $(".dripp").click(function(){
                $(".showForm").attr("class", "showForm");
                $(".success").attr("class", "success hide");
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

            window.readList = [];
            var internalReadList = [];
            $(".readLater").click(function(){
                var articleId = window.curArticle;
                if($('.readLater.grey2').hasClass('hide')) {
                    $(".readLater.grey2").attr("class", 'opinionDripp readLater grey2');
                    $(".readLater.blue").attr("class", 'opinionDripp readLater blue hide');
                    $.ajax({
                        url:'http://localhost:5000/removeReadItLater',
                        data: {userId: window.myID, name: "readLater", articleId: articleId, dateAdded: "2014-04-29 17:12:58", bucketId: 2},
                        type:'get'
                    });
                    for(var i=0; i < window.readList.length; i++){
                        if (articleId === window.readList[i]) {
                            readList.splice(readList.indexOf(articleId),1);
                        }
                    }
                return;
                }
                if($('.readLater.blue').hasClass('hide')) {
                    $(".readLater.grey2").attr("class", 'opinionDripp readLater grey2 hide');
                    $(".readLater.blue").attr("class", 'opinionDripp readLater blue');
                    $.ajax({
                        url:'http://localhost:5000/readItLater',
                        data: {userId: window.myID, name: "readLater", articleId: articleId, bucketId: 2},
                        type:'get'
                    });
                    internalReadList.push(articleId);
                }
                window.readList = internalReadList;
            });

            $(document).keydown(function(e){
                if (e.keyCode == 37) {
                    javascript:sliders[0].goToPrev();
                }
                if (e.keyCode == 39) {
                    javascript:sliders[0].goToNext();
                }
            });
        },

        loadArticleData : function(){
            $.ajax({
                url:'http://localhost:5000/articles',
                data: {user: window.myID}, //need to fix for current user
                method:'get',
                success:this.handlerData
            });
        },
};