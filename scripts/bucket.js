var bucket_results;

var feed; 

window.BUCKET_METHOD = {

        compileBuckets:function(dripps_data, readItLater_data, conversation_data){
            
            window.setBucketLikes = function correctLikes() {
                if (window.selItem['userLiked']) {
                    $(".like.grey2").attr("class", 'opinionDripp like grey2 hide')
                    $(".like.blue").attr("class", 'opinionDripp like blue');
                    $(".up").html(window.selItem.numLikes);
                }
                if (window.selItem['userLiked'] === false) {
                    $(".like.grey2").attr("class", 'opinionDripp like grey2')
                    $(".like.blue").attr("class", 'opinionDripp like blue hide');
                    $(".up").html(window.selItem.numLikes);
                }
                if (window.selItem['userDisliked']) {
                    $(".dislike.grey2").attr("class", 'opinionDripp dislike grey2 hide')
                    $(".dislike.blue").attr("class", 'opinionDripp dislike blue');
                    $(".down").html(window.selItem.numDislikes);
                }
                if (window.selItem['userDisliked'] === false) {
                    $(".dislike.grey2").attr("class", 'opinionDripp dislike grey2')
                    $(".dislike.blue").attr("class", 'opinionDripp dislike blue hide');
                    $(".down").html(window.selItem.numDislikes);
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

                    var templateSource = $("#selItem-template").html(),
                    messageListTemplate = Handlebars.compile(templateSource),
                    readItLaterHTML = messageListTemplate({"selItem":window.selItem});
                    $('#selItem').html(readItLaterHTML);
                    $('#selDripp').html("");
                }

                

                bindMessages(messageListTemplate, conversation_data);
            });
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

    //what do do???
     if (window.selItem['userLiked']) {
        $(".like.grey2").attr("class", 'opinionDripp like grey2 hide')
        $(".like.blue").attr("class", 'opinionDripp like blue');
        $(".up").html(window.selItem.numLikes);
    }
    if (articlesResults[window.curArticle]['userLiked'] === false) {
        $(".like.grey2").attr("class", 'opinionDripp like grey2')
        $(".like.blue").attr("class", 'opinionDripp like blue hide');
        $(".up").html(articlesResults[window.curArticle].numLikes);
    }
    if (articlesResults[window.curArticle]['userDisliked']) {
        $(".dislike.grey2").attr("class", 'opinionDripp dislike grey2 hide')
        $(".dislike.blue").attr("class", 'opinionDripp dislike blue');
        $(".down").html(articlesResults[window.curArticle].numDislikes);
    }
    if (articlesResults[window.curArticle]['userDisliked'] === false) {
        $(".dislike.grey2").attr("class", 'opinionDripp dislike grey2')
        $(".dislike.blue").attr("class", 'opinionDripp dislike blue hide');
        $(".down").html(articlesResults[window.curArticle].numDislikes);
    }

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



