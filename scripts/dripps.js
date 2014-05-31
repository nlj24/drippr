var article_results;
window.chunkSize = 100;
window.articlesData = {};
window.articlesData["All"] = [];


window.ARTICLE_METHOD ={

        handlerData:function(resJSON){
            

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
        },

        loadArticleData : function(){
            $.ajax({
                url: window.address + 'articles',
                data: {user: window.myID, numArticles: window.chunkSize}, //need to fix for current user
                method:'get',
                success:this.handlerData
            });
        },
};

$(document).keydown(function(e){
    if (e.keyCode == 37) {
        javascript:sliders[0].goToPrev();
    }
    if (e.keyCode == 39) {
        javascript:sliders[0].goToNext();
    }
});


window.bindDripps = function() {
    $(".drippsBub").click(function(){
        window.ARTICLE_METHOD.loadArticleData();
        window.setDrippLikes();
        $("#buckets").attr("class", "container-fluid hide");
        $("#bucketsHeader").attr("class", "col-md-5 headingPad hide");
        $("#dripps").attr("class", "container-fluid");
        $("#drippsHeader").attr("class", "col-md-5 headingPad");
        $("#groups").attr("class", "container-fluid hide");
        $("#groupsHeader").attr("class", "col-md-5 headingPad hide");
    });

    $(".bucketsBub").click(function(){
        window.BUCKET_METHOD.loadArticleData();
        $("#dripps").attr("class", "container-fluid hide");
        $("#drippsHeader").attr("class", "col-md-5 headingPad hide");
        $("#buckets").attr("class", "container-fluid");
        $("#bucketsHeader").attr("class", "col-md-5 headingPad");
        $("#groups").attr("class", "container-fluid hide");
        $("#groupsHeader").attr("class", "col-md-5 headingPad hide");
    });

    $(".groupsBub").click(function(){
        window.GROUP_METHOD.loadGroups();
        $("#buckets").attr("class", "container-fluid hide");
        $("#bucketsHeader").attr("class", "col-md-5 headingPad hide");
        $("#dripps").attr("class", "container-fluid hide");
        $("#drippsHeader").attr("class", "col-md-5 headingPad hide");
        $("#groups").attr("class", "container-fluid");
        $("#groupsHeader").attr("class", "col-md-5 headingPad");
    });
    
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

        var templateSource = $("#article-template").html(), 
        template = Handlebars.compile(templateSource),
        articleHTML = template({"articles":feed});
        $('#articles').html(articleHTML);


        window.curCategory = $(e.target).parents('.categ').attr("category");

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
        console.log(window.curArticle);
        if($('.like.grey2').hasClass('hide')) {
            console.log('ddd');
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
    
    $(function() {
        var availableTags = window.groupList;
        $( "#tags" ).autocomplete({
            source: availableTags
        });
    });

    $(".sendGroup").click(function(){            
        var groupSel = $('#tags').val();
        console.log(groupSel);
        var groupId = window.groupListDict[groupSel];
        console.log(groupId);
        if (groupId) {
            $.ajax({
                url: window.address + 'sendDripp',
                data: {fromUserId: window.myID, recipientGroup: groupId, recipientFriendIds: -1, articleId: window.curArticle},
                type:'get'
            });
        }
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
}

window.positions = {};
window.curCategory = "All";