var bucket_results;

var feed; 

window.BUCKET_METHOD = {

        compileBuckets:function(dripps_data, readItLater_data, conversation_data){
            
            window.setBucketLikes = function correctLikes() {
                if (window.selItem) {
                    $(".like2.grey2").attr("class", 'opinionBucket like2 grey2 hide')
                    $(".like2.blue").attr("class", 'opinionBucket like2 blue');
                    $(".up2").html(window.selItem.numLikes);
                }
                if (window.selItem['userLiked'] === false) {
                    $(".like2.grey2").attr("class", 'opinionBucket like2 grey2')
                    $(".like2.blue").attr("class", 'opinionBucket like2 blue hide');
                    $(".up2").html(window.selItem.numLikes);
                }
                if (window.selItem['userDisliked']) {
                    $(".dislike2.grey2").attr("class", 'opinionBucket dislike2 grey2 hide')
                    $(".dislike2.blue").attr("class", 'opinionBucket dislike2 blue');
                    $(".down2").html(window.selItem.numDislikes);
                }
                if (window.selItem['userDisliked'] === false) {
                    $(".dislike2.grey2").attr("class", 'opinionBucket dislike2 grey2')
                    $(".dislike2.blue").attr("class", 'opinionBucket dislike2 blue hide');
                    $(".down2").html(window.selItem.numDislikes);
                }
                if (window.selItem) {
                    $(".readLater2.grey2").attr("class", 'opinionBucket readLater2 grey2 hide')
                    $(".readLater2.blue").attr("class", 'opinionBucket readLater2 blue');
                }
                if (window.selItem['userReadItLater'] === false) {
                    $(".readLater2.grey2").attr("class", 'opinionBucket readLater2 grey2')
                    $(".readLater2.blue").attr("class", 'opinionBucket readLater2 blue hide');
                }
            }
            
            if (dripps_data.length == 0 ) {

            }
            else{
                feed = dripps_data;
                window.selItem = feed[0];
                console.log(window.selItem);
                var convo = [];
                var convoId = feed[0]['conversationId'];
                for (var i=0;i<conversation_data.length;i++) {
                    if (convoId == conversation_data[i]['conversationId']) {
                        convo.push(conversation_data[i]);
                    }
                }

                window.articlesData = {};
                for (var i=0;i<feed.length;i++) {
                    window.articlesData[feed[i].articleId2] = feed[i];
                }


                var templateSource = $("#items-template").html(),
                template = Handlebars.compile(templateSource),
                itemHTML = template({"buckets":feed});
                $('#items').html(itemHTML);

                var templateSource = $("#selDripp-template").html(),
                messageListTemplate = Handlebars.compile(templateSource),
                drippsHTML = messageListTemplate({"selItem":window.selItem, "messages":convo});
                $('#selDripp').html(drippsHTML);

                $('.indMess.' + window.myID).attr("class", "indMess ownMess " + window.myID);          
                bindMessages(messageListTemplate, conversation_data);     
                bindButtons();
                window.setBucketLikes();
            }



           

            $('.selBucket').click(function(e){
                $('#selItem').html("");
                $('#selDripp').html("");


                if ($(e.target).attr('bucketIdentifier') === 'dripps') {
                    feed = dripps_data;
                }

                 if ($(e.target).attr('bucketIdentifier') === 'readItLater') {
                    feed = readItLater_data;
                }

                templateSource = $("#items-template").html(),
                template = Handlebars.compile(templateSource),
                itemHTML = template({"buckets":feed});
                
                $('#items').html(itemHTML);

                if ($(e.target).attr('bucketIdentifier') === 'dripps') {
                
                var templateSource = $("#selDripp-template").html(),
                messageListTemplate = Handlebars.compile(templateSource);
                    
                    if (feed.length > 0) {
                        window.selItem = feed[0];

                        displayConvos(window.selItem, $("#" + feed[0]['id']).attr("conversation_id"), messageListTemplate, conversation_data);

                    }

                }

                if ($(e.target).attr('bucketIdentifier') === 'readItLater') {

                    if (feed.length > 0) {
                        window.selItem = feed[0];
                    }

                    var templateSource = $("#selItem-template").html(),
                    messageListTemplate = Handlebars.compile(templateSource),
                    readItLaterHTML = messageListTemplate({"selItem":window.selItem});
                    $('#selDripp').html(readItLaterHTML);
                }

                

                bindMessages(messageListTemplate, conversation_data);
            });

            window.setBucketLikes();
        },

        handlerData2:function(dripps_data, readItLater_data){


            $.ajax({
                // url:'json/articles.json',
                url:'http://localhost:5000/conversations',
                data: {user: window.myID},
                method:'get',
                success: function(data2){
                    BUCKET_METHOD.compileBuckets(dripps_data, readItLater_data, data2);
                }
            });

        },

        handlerData:function(dripps_data){
            $.ajax({
                // url:'json/articles.json',
                url:'http://localhost:5000/buckets',
                data: {user: window.myID},
                method:'get',
                success: function(data){
                    BUCKET_METHOD.handlerData2(dripps_data, data);
                }
            });

        },

        loadArticleData : function(){
 
            $.ajax({
                // url:'json/articles.json',
                url:'http://localhost:5000/dripps',
                data: {user: window.myID},
                method:'get',
                success:this.handlerData
            });
            
        },
};

function bindMessages(template, conversation_data){
    $('.messageItem').click(function(e){
            var id = $(e.target).attr('message_id');
            for (var i=0;i<feed.length;i++) {
                    if (id == feed[i]['id']) {
                        window.selItem = feed[i];
                    }
                }

            displayConvos(window.selItem, $(e.target).attr('conversation_id'), template, conversation_data);
            
        bindButtons();
    });
}

function bindButtons(){
    $("#messageSend").click(function(){
        console.log('hi');
        content = $('#messageInput').val();
        if (content !== '') {
            $.ajax({
                url:'http://localhost:5000/sendConvo',
                data: {conversationId: window.selItem['conversationId'], userId: window.myID, content: content},
                type:'get'
            });
            $('#messageInput').val('');
        }
    });
    $('#messageInput').keypress(function(e){
        if(e.which == 13) {
            $('#messageSend').click();
        }
    });

    $(".like2").click(function(){
        var articleId = window.selItem['articleId'];
        if($('.like2.grey2').hasClass('hide')) {
            $(".up2").text(--window.selItem.numLikes);
            $(".like2.grey2").attr("class", 'opinionBucket like2 grey2');
            $(".like2.blue").attr("class", 'opinionBucket like2 blue hide');
            $.ajax({
                url:'http://localhost:5000/removeLikes',
                data: {user: window.myID, article: articleId},
                type:'get'
            });
            window.selItem['userLiked'] = false;
            return;
        };

        if ($(".dislike2.grey2").hasClass("hide")) {
            $(".dislike2.grey2").attr("class", 'opinionBucket dislike2 grey2');
            $(".dislike2.blue").attr("class", 'opinionBucket dislike2 blue hide');
            $(".down2").text(--window.selItem.numDislikes);
            $.ajax({
                url:'http://localhost:5000/removeDislikes',
                data: {user: window.myID, article: articleId},
                type:'get'
            });
            window.selItem['userLiked'] = true;
            window.selItem['userDisliked'] = false;                
        };
        if($('.like2.blue').hasClass('hide')) {
            $(".up2").text(++window.selItem.numLikes);
            $(".like2.grey2").attr("class", 'opinionBucket like2 grey2 hide')
            $(".like2.blue").attr("class", 'opinionBucket like2 blue');
            $.ajax({
                url:'http://localhost:5000/likes',
                data: {user: window.myID, article: articleId},
                type:'get'
            });
            window.selItem['userLiked'] = true;
        };
    });

    $(".dislike2").click(function(){
        var articleId = window.selItem['articleId'];
        if($('.dislike2.grey2').hasClass('hide')) {
            $(".down2").text(--window.selItem.numDislikes);
            $(".dislike2.grey2").attr("class", 'opinionBucket dislike2 grey2');
            $(".dislike2.blue").attr("class", 'opinionBucket dislike2 blue hide');
            $.ajax({
                url:'http://localhost:5000/removeDislikes',
                data: {user: window.myID, article: articleId},
                type:'get'
            }); 
            window.selItem['userDisliked'] = false;
            return;
        };

        if ($(".like2.grey2").hasClass("hide")) {
            $(".like2.grey2").attr("class", 'opinionBucket like2 grey2');
            $(".like2.blue").attr("class", 'opinionBucket like2 blue hide');
            $(".up2").text(--window.selItem.numLikes);
            $.ajax({
                url:'http://localhost:5000/removeLikes',
                data: {user: window.myID, article: articleId},
                type:'get'
            });
            window.selItem['userLiked'] = false;
            window.selItem['userDisliked'] = true;
        };

        if($('.dislike2.blue').hasClass('hide')) {
            $(".down2").text(++window.selItem.numDislikes);
            $(".dislike2.grey2").attr("class", 'opinionBucket dislike2 grey2 hide');
            $(".dislike2.blue").attr("class", 'opinionBucket dislike2 blue');
            $.ajax({
                url:'http://localhost:5000/dislikes',
                data: {user: window.myID, article: articleId},
                type:'get'
            });
            window.selItem['userDisliked'] = true;
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

    $(".readLater2").click(function(){
        var articleId = window.selItem['articleId'];
        if($('.readLater2.grey2').hasClass('hide')) {
            $(".readLater2.grey2").attr("class", 'opinionBucket readLater2 grey2');
            $(".readLater2.blue").attr("class", 'opinionBucket readLater2 blue hide');
            $.ajax({
                url:'http://localhost:5000/removeReadItLater',
                data: {userId: window.myID, name: "readLater", articleId: articleId, dateAdded: "2014-04-29 17:12:58", bucketId: 2},
                type:'get'
            });
            window.selItem['userReadItLater'] = false;
            return;
        }
        if($('.readLater2.blue').hasClass('hide')) {
            $(".readLater2.grey2").attr("class", 'opinionBucket readLater2 grey2 hide');
            $(".readLater2.blue").attr("class", 'opinionBucket readLater2 blue');
            $.ajax({
                url:'http://localhost:5000/readItLater',
                data: {userId: window.myID, name: "readLater", articleId: articleId, bucketId: 2},
                type:'get'
            });
            window.selItem['userReadItLater'] = true;
        }
    });

    window.setBucketLikes();

}

function displayConvos(selItem, convoId, template, conversation_data){
    convo = [];    
    for (var i=0;i<conversation_data.length;i++) {
        if (convoId == conversation_data[i]['conversationId']) {
            convo.push(conversation_data[i]);
        }
    }
    var drippsHTML = template({"selItem":window.selItem, "messages":convo});
    $('#selDripp').html(drippsHTML);
    $('.indMess.' + window.myID).attr("class", "indMess ownMess " + window.myID);
}



