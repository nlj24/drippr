var bucket_results;

var feed; 

var BUCKET_METHOD ={

        compileBuckets:function(dripps_data, readItLater_data, conversation_data){

            console.log(dripps_data);
            
            console.log(readItLater_data);
            console.log(conversation_data);
            
            feed = dripps_data;
            var selItem = [];
            selItem.push(feed[0]);


            var convo = [];
            var convoId = feed[0]['conversationId'];
            for (var i=0;i<conversation_data.length;i++) {
                if (parseInt(convoId) === conversation_data[i]['conversationId']) {
                    convo.push(conversation_data[i]);
                }
            }

            var articlesData = {};
            for (var i=0;i<feed.length;i++) {
                articlesData[feed[i].articleId] = feed[i];
            }

            var templateSource = $("#items-template").html(),
            template = Handlebars.compile(templateSource),
            itemHTML = template({"buckets":feed});
            $('#items').html(itemHTML);

            var templateSource = $("#selDripp-template").html(),
            messageListTemplate = Handlebars.compile(templateSource),
            drippsHTML = messageListTemplate({"selItems":selItem});
            $('#selDripp').html(drippsHTML);
            drippsHTML = messageListTemplate({"messages":convo});
            $('#messagesDiv').html(drippsHTML);

            $('.selBucket').click(function(e){
             
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
                    

                var selItem = [];

                selItem.push(feed[0]);
                console.log($("#" + feed[0]['id']));
                displayConvos(selItem, $("#" + feed[0]['id']).attr("conversation_id"), messageListTemplate, conversation_data);

                    }



                if ($(e.target).attr('bucketIdentifier') === 'readItLater') {

                    var templateSource = $("#selItem-template").html(),
                    messageListTemplate = Handlebars.compile(templateSource),
                    readItLaterHTML = messageListTemplate({"selItems":selItem});
                    $('#selItem').html(readItLaterHTML);
                    drippsHTML = messageListTemplate();
                    $('#selDripp').html(drippsHTML);
                }

                

                bindMessages(messageListTemplate, conversation_data);
            });

            bindMessages(messageListTemplate, conversation_data);

            
        },

        handlerData2:function(dripps_data, readItLater_data){

            $.ajax({
                // url:'json/articles.json',
                url:'http://localhost:5000/conversations',
                data: {user: 1},
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
                data: {user: 1},
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
                data: {user: 1},
                method:'get',
                success:this.handlerData
            });

            
        },
};
 
$(document).ready(function(){
    BUCKET_METHOD.loadArticleData();
});


function bindMessages(template, conversation_data){
    $('.messageItem').click(function(e){
            var id = $(e.target).attr('id');
            selItem = [];

            for (var i=0;i<feed.length;i++) {
                    if (id == feed[i]['id']) {
                        selItem.push(feed[i]);
                    }
                }

            displayConvos(selItem, $(e.target).attr('conversation_id'), template, conversation_data);
            
            });
    
    bindButtons();
}

function bindButtons(){
        

            $(".like").click(function(){
                var articleId = $('#headline').attr('articleId');
                
                if($('.like.grey2').hasClass('hide')) {
                    $("#up").text(--articlesData[articleId].numLikes);
                    $(".like.grey2").attr("class", 'opinion like grey2');
                    $(".like.blue").attr("class", 'opinion like blue hide');
                    return;
                };

                if ($(".dislike.grey2").hasClass("hide")) {
                    $(".dislike.grey2").attr("class", 'opinion dislike grey2');
                    $(".dislike.blue").attr("class", 'opinion dislike blue hide');
                    $("#down").text(--articlesData[articleId].numDislikes);
                };

                if($('.like.blue').hasClass('hide')) {
                    $("#up").text(++articlesData[articleId].numLikes);
                    $(".like.grey2").attr("class", 'opinion like grey2 hide')
                    $(".like.blue").attr("class", 'opinion like blue');
                };
                
                $.ajax({
                    url:'http://localhost:5000/likes',
                    data: {user: 1, article: articleId},
                    type:'get'
                });
            });

            $(".dislike").click(function(){
                var articleId = $('#headline').attr('articleId');

                if($('.dislike.grey2').hasClass('hide')) {
                    $("#down").text(--articlesData[articleId].numDislikes);
                    $(".dislike.grey2").attr("class", 'opinion dislike grey2');
                    $(".dislike.blue").attr("class", 'opinion dislike blue hide');
                    return;
                };

                if ($(".like.grey2").hasClass("hide")) {
                    $(".like.grey2").attr("class", 'opinion like grey2');
                    $(".like.blue").attr("class", 'opinion like blue hide');
                    $("#up").text(--articlesData[articleId].numLikes);
                };

                if($('.dislike.blue').hasClass('hide')) {
                    $("#down").text(++articlesData[articleId].numDislikes);
                    $(".dislike.grey2").attr("class", 'opinion dislike grey2 hide');
                    $(".dislike.blue").attr("class", 'opinion dislike blue');
                };

                $.ajax({
                    url:'http://localhost:5000/dislikes',
                    data: {user: 1, article: articleId},
                    type:'get'
                });
            });

            $(".dripp").click(function(){
                alert("add ability to send");
            });

            $(".readLater").click(function(){
                $(".readLater.grey2").attr("class", 'opinion readLater grey2 hide');
                $(".readLater.blue").attr("class", 'opinion readLater blue');
            });
}

function displayConvos(selItem, convoId, template, conversation_data){
    convo = [];
    console.log(convoId);
    
    for (var i=0;i<conversation_data.length;i++) {
        if (convoId == conversation_data[i]['conversation_id']) {
            convo.push(conversation_data[i]);
        }
    }
    console.log(selItem);                
    var drippsHTML = template({"selItems":selItem});
    console.log(drippsHTML);
    $('#selDripp').html(drippsHTML);
    drippsHTML = template({"messages":convo});
    $('#messagesDiv').html(drippsHTML);
}

