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
                if (convoId == conversation_data[i]['conversationId']) {
                    convo.push(conversation_data[i]);
                }
            }
            console.log(convoId);

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
                data: {user: 100000927715733},
                method:'get',
                success: function(data2){
                    console.log(data2);
                    BUCKET_METHOD.compileBuckets(dripps_data, readItLater_data, data2);
                }
            });


        },

        handlerData:function(dripps_data){

            $.ajax({
                // url:'json/articles.json',
                url:'http://localhost:5000/buckets',
                data: {user: 100000927715733},
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
                data: {user: 100000927715733},
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

    // $(".like").click(function(){
    //     console.log(window.articlesData);
    //     if($('.like.grey2').hasClass('hide')) {
    //         $("#up").text(--articlesData['articleId'].numLikes);
    //         $(".like.grey2").attr("class", 'opinion like grey2');
    //         $(".like.blue").attr("class", 'opinion like blue hide');
    //         $.ajax({
    //             url:'http://localhost:5000/removeLikes',
    //             data: {user: window.myID, article: articleId2},
    //             type:'get'
    //         });
    //         window.articlesData[articleId2]['userLiked'] = false;
    //         return;
    //     };

    //     if ($(".dislike.grey2").hasClass("hide")) {
    //         $(".dislike.grey2").attr("class", 'opinion dislike grey2');
    //         $(".dislike.blue").attr("class", 'opinion dislike blue hide');
    //         $("#down").text(--articlesData['articleId'].numDislikes);
    //         $.ajax({
    //             url:'http://localhost:5000/removeDislikes',
    //             data: {user: window.myID, article: articleId2},
    //             type:'get'
    //         });
    //         window.articlesData[articleId2]['userLiked'] = true;
    //         window.articlesData[articleId2]['userDisliked'] = false;                
    //     };
    //     if($('.like.blue').hasClass('hide')) {
    //         $("#up").text(++articlesData['articleId'].numLikes);
    //         $(".like.grey2").attr("class", 'opinion like grey2 hide')
    //         $(".like.blue").attr("class", 'opinion like blue');
    //         $.ajax({
    //             url:'http://localhost:5000/likes',
    //             data: {user: window.myID, article: articleId2},
    //             type:'get'
    //         });
    //         window.articlesData[articleId2]['userLiked'] = true;
    //     };
    // });

    // window.dislikeList = [];
    // var internalDislike = [];
    // $(".dislike").click(function(){
    //     if($('.dislike.grey2').hasClass('hide')) {
    //         $("#down").text(--window.articlesData[articleId2]['articleId'].numDislikes);
    //         $(".dislike.grey2").attr("class", 'opinion dislike grey2');
    //         $(".dislike.blue").attr("class", 'opinion dislike blue hide');
    //         $.ajax({
    //             url:'http://localhost:5000/removeDislikes',
    //             data: {user: window.myID, article: articleId2},
    //             type:'get'
    //         });
    //         window.articlesData[articleId2]['userDisliked'] = false;
    //         return;
    //     };

    //     if ($(".like.grey2").hasClass("hide")) {
    //         $(".like.grey2").attr("class", 'opinion like grey2');
    //         $(".like.blue").attr("class", 'opinion like blue hide');
    //         $("#up").text(--window.articlesData[articleId2]['articleId'].numLikes);
    //         $.ajax({
    //             url:'http://localhost:5000/removeLikes',
    //             data: {user: window.myID, article: articleId2},
    //             type:'get'
    //         });
    //         window.articlesData[articleId2]['userLiked'] = false;
    //         window.articlesData[articleId2]['userDisliked'] = true;
    //     };

    //     if($('.dislike.blue').hasClass('hide')) {
    //         $("#down").text(++window.articlesData[articleId2]['articleId'].numDislikes);
    //         $(".dislike.grey2").attr("class", 'opinion dislike grey2 hide');
    //         $(".dislike.blue").attr("class", 'opinion dislike blue');
    //         $.ajax({
    //             url:'http://localhost:5000/dislikes',
    //             data: {user: window.myID, article: articleId2},
    //             type:'get'
    //         });
    //         window.articlesData[articleId2]['userDisliked'] = true;
    //     };
    // });

    // $(".dripp").click(function(){
    //     $('#fb-form').modal({
    //         fadeDuration: 250,
    //         fadeDelay: 1.2
    //     });
    //     $('#fb-form').bind("keyup keypress", function(e) {
    //         var code = e.keyCode || e.which; 
    //         if (code  == 13) {
    //             e.preventDefault();
    //             return false;
    //         }
    //     });
    // });

   
    // $(".readLater").click(function(){

    //     console.log(window.articlesData[articleId2]['articleId']);
    //     if($('.readLater.grey2').hasClass('hide')) {
    //         $(".readLater.grey2").attr("class", 'opinion readLater grey2');
    //         $(".readLater.blue").attr("class", 'opinion readLater blue hide');
    //         $.ajax({
    //             url:'http://localhost:5000/removeReadItLater',
    //             data: {userId: window.myID, name: "readLater", articleId: window.articlesData[articleId2]['articleId'], dateAdded: "2014-04-29 17:12:58", bucketId: 2},
    //             type:'get'
    //         });
    //     return;
    //     }
    //     if($('.readLater.blue').hasClass('hide')) {
    //         $(".readLater.grey2").attr("class", 'opinion readLater grey2 hide');
    //         $(".readLater.blue").attr("class", 'opinion readLater blue');
    //         $.ajax({
    //             url:'http://localhost:5000/readItLater',
    //             data: {userId: window.myID, name: "readLater", articleId: articlesData[articleId2]['articleId'], bucketId: 2},
    //             type:'get'
    //         });
    //     }
    // });

}

function displayConvos(selItem, convoId, template, conversation_data){
    convo = [];
    console.log(conversation_data);
    
    for (var i=0;i<conversation_data.length;i++) {
        if (convoId == conversation_data[i]['conversation_id']) {
            convo.push(conversation_data[i]);
        }
    }
    console.log(selItem);                
    var drippsHTML = template({"selItems":selItem});
    console.log(convo);
    $('#selDripp').html(drippsHTML);
    drippsHTML = template({"messages":convo});
    $('#messagesDiv').html(drippsHTML);
}

