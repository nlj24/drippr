var article_results;
window.chunkSize = 100;
window.articlesData = {};
window.articlesData["All"] = [];
window.callingback = {};


window.ARTICLE_METHOD ={

    handlerData:function(resJSON){

        for (var ii = 0; ii < resJSON.length; ii++) {
            if (moment().format('MMMM Do YYYY') === resJSON[ii]['date'].format('MMMM Do YYYY')) {
                resJSON[ii]['date'] = "Today, " + resJSON[ii]['date'].format('h:mma');
            }
            else {
                resJSON[ii]['date'] = resJSON[ii]['date'].format('MMMM Do, h:mma');
            }
        }

        article_results = resJSON;

        window.article_results = resJSON;
        var cat;

        for (var i=0;i<  resJSON.length;i++) {
            cat = resJSON[i].category;
            if(!(cat in window.articlesData)){
                window.articlesData[cat] = [];
            }
                window.articlesData[cat].push(resJSON[i]);
                window.articlesData["All"].push(resJSON[i]);
                window.articlesData[resJSON[i].id] = resJSON[i];
        }

        window.articlesResults = window.articlesData;
        var categories = Object.keys(window.articlesResults);

        for(var ii = 0; ii < categories.length; ii++){
            if(!(categories[ii] in window.positions)){
                window.positions[categories[ii]] = 0;
            }

        }

        var feed = window.articlesData[window.curCategory].slice(0, 50);

        var templateSource = $("#article-template").html(),
        template = Handlebars.compile(templateSource),
        articleHTML = template({"articles":feed});
        $('#articles').html(articleHTML);

        $(".dripp").click(function(){
            window.articleSendId = window.curArticle;
            $(".showForm").attr("class", "showForm");
            $(".success").attr("class", "success hide");
        });
    },

    loadArticleData : function(){
        $.ajax({
            url: window.address + 'articles',
            data: {user: window.myID, numArticles: window.chunkSize}, //need to fix for current user
            method:'get',
            success:this.handlerData
        });
    },
    loadArticleDataCategory : function(category, lastId, callback){
        window.callingback[category] = true;
        var url;
        if (category == "All") {
            url = window.address + 'articles';
        } else{
             url = window.address + 'articles/' + category;
        }
        $.ajax({
            url: url,
            data: {user: window.myID, numArticles: window.chunkSize, lastId: lastId}, //need to fix for current user
            method:'get',
            success:function(data){

                for (var ii = 0; ii < data.length; ii++) {
                    if (moment().format('MMMM Do YYYY') === data[ii]['date'].format('MMMM Do YYYY')) {
                        data[ii]['date'] = "Today, " + data[ii]['date'].format('h:mm a');
                    }
                    else {
                        data[ii]['date'] = data[ii]['date'].format('MMMM Do, h:mm a');
                    }
                    window.article_results.push(data[ii]);
                }

                var cat;

                for (var i=0;i<  data.length;i++) {
                    cat = data[i].category;
                    
                    window.articlesData[cat].push(data[i]);
                    window.articlesData["All"].push(data[i]);
                    window.articlesData[data[i].id] = data[i];
                }
             window.callingback[category] = false;
            callback();
            }
        });
    }
};

$(document).keydown(function(e){

    if ((!$("#dripps").hasClass("hide")) && ($("#myModal").attr("aria-hidden") == "true" )) {
        if (e.keyCode == 37) {
            javascript:sliders[0].goToPrev();
        }
        if (e.keyCode == 39) {
            javascript:sliders[0].goToNext();
        }
    }
});


window.bindDripps = function() {
    
    
    $('.categ').css("background", "white");
    $('.categ').css("color", "#6D6E70");
    $(".topCat").css("background", "#6D6E70");
    $('.topCat').css("color", "white");
    $(".topCatImg.grey").attr("class", 'topCatImg catImg grey hide');
    $(".topCatImg.white").attr("class", 'topCatImg catImg white');


    
    $('.categ').click(function(e){
        var id = $(e.target).parents('.categ').attr("category");

        if (window.positions[id] > 15) {

                feed = window.articlesData[id].slice(window.positions[id] - 10, Math.min(window.positions[id] + 40, window.articlesData[id].length));
            
        }else{
            feed = window.articlesData[id];
            
        }

        window.curCategory = $(e.target).parents('.categ').attr("category");

        var templateSource = $("#article-template").html(), 
        template = Handlebars.compile(templateSource),
        articleHTML = template({"articles":feed});
        $('#articles').html(articleHTML);

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
            $(".up").text(--window.articlesData[articleId].numLikes);
            $(".like.grey2").attr("class", 'opinionDripp like grey2');
            $(".like.blue").attr("class", 'opinionDripp like blue hide');
            $.ajax({
                url: window.address + 'removeLikes',
                data: {user: window.myID, article: articleId},
                type:'get'
            });
            window.articlesData[articleId]['userLiked'] = false;
            return;
        };

        if ($(".dislike.grey2").hasClass("hide")) {
            $(".dislike.grey2").attr("class", 'opinionDripp dislike grey2');
            $(".dislike.blue").attr("class", 'opinionDripp dislike blue hide');
            $(".down").text(--window.articlesData[articleId].numDislikes);
            $.ajax({
                url: window.address + 'removeDislikes',
                data: {user: window.myID, article: articleId},
                type:'get'
            });
            window.articlesData[articleId]['userLiked'] = true;
            window.articlesData[articleId]['userDisliked'] = false;                
        };
        if($('.like.blue').hasClass('hide')) {
            $(".up").text(++window.articlesData[articleId].numLikes);
            $(".like.grey2").attr("class", 'opinionDripp like grey2 hide')
            $(".like.blue").attr("class", 'opinionDripp like blue');
            $.ajax({
                url: window.address + 'likes',
                data: {user: window.myID, article: articleId},
                type:'get'
            });
            window.articlesData[articleId]['userLiked'] = true;
        };
    });

    $(".dislike").click(function(){
        var articleId = window.curArticle;
        if($('.dislike.grey2').hasClass('hide')) {
            $(".down").text(--window.articlesData[articleId].numDislikes);
            $(".dislike.grey2").attr("class", 'opinionDripp dislike grey2');
            $(".dislike.blue").attr("class", 'opinionDripp dislike blue hide');
            $.ajax({
                url: window.address + 'removeDislikes',
                data: {user: window.myID, article: articleId},
                type:'get'
            }); 
            window.articlesData[articleId]['userDisliked'] = false;
            return;
        };

        if ($(".like.grey2").hasClass("hide")) {
            $(".like.grey2").attr("class", 'opinionDripp like grey2');
            $(".like.blue").attr("class", 'opinionDripp like blue hide');
            $(".up").text(--window.articlesData[articleId].numLikes);
            $.ajax({
                url: window.address + 'removeLikes',
                data: {user: window.myID, article: articleId},
                type:'get'
            });
            window.articlesData[articleId]['userLiked'] = false;
            window.articlesData[articleId]['userDisliked'] = true;
        };

        if($('.dislike.blue').hasClass('hide')) {
            $(".down").text(++window.articlesData[articleId].numDislikes);
            $(".dislike.grey2").attr("class", 'opinionDripp dislike grey2 hide');
            $(".dislike.blue").attr("class", 'opinionDripp dislike blue');
            $.ajax({
                url: window.address + 'dislikes',
                data: {user: window.myID, article: articleId},
                type:'get'
            });
            window.articlesData[articleId]['userDisliked'] = true;
        };
    });

    $(".readLater").click(function(){
        var articleId = window.curArticle;
        if($('.readLater.grey2').hasClass('hide')) {
            $(".readLater.grey2").attr("class", 'opinionDripp readLater grey2');
            $(".readLater.blue").attr("class", 'opinionDripp readLater blue hide');
            $.ajax({
                url: window.address + 'removeReadItLater',
                data: {userId: window.myID, name: "readLater", articleId: articleId, bucketId: 2},
                type:'get'
            });
            window.articlesData[articleId]['userReadItLater'] = false;
            return;
        }
        if($('.readLater.blue').hasClass('hide')) {
            $(".readLater.grey2").attr("class", 'opinionDripp readLater grey2 hide');
            $(".readLater.blue").attr("class", 'opinionDripp readLater blue');
            $.ajax({
                url: window.address + 'readItLater',
                data: {userId: window.myID, name: "readLater", articleId: articleId, bucketId: 2},
                type:'get'
            });
            window.articlesData[articleId]['userReadItLater'] = true;
        }
    });

    window.BUCKET_METHOD.loadArticleData();
}

window.positions = {};
window.curCategory = "All";