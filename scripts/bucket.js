var bucket_results;

var feed; 

window.BUCKET_METHOD = {

        compileBuckets:function(dripps_data, readItLater_data, conversation_data){
            console.log(conversation_data);
            window.setBucketLikes = function correctLikes() {
                if (window.selItem['userLiked']) {
                    $(".like2.grey2").attr("class", 'opinionBucket like2 grey2 hide');
                    $(".like2.blue").attr("class", 'opinionBucket like2 blue');
                    $(".dripp2").attr("class", 'opinionBucket dripp2');
                    $(".up2").html(window.selItem.numLikes);
                }
                if (window.selItem['userLiked'] === false) {
                    $(".like2.grey2").attr("class", 'opinionBucket like2 grey2');
                    $(".like2.blue").attr("class", 'opinionBucket like2 blue hide');
                    $(".dripp2").attr("class", 'opinionBucket dripp2');
                    $(".up2").html(window.selItem.numLikes);
                }
                if (window.selItem['userDisliked']) {
                    $(".dislike2.grey2").attr("class", 'opinionBucket dislike2 grey2 hide');
                    $(".dislike2.blue").attr("class", 'opinionBucket dislike2 blue');
                    $(".dripp2").attr("class", 'opinionBucket dripp2');
                    $(".down2").html(window.selItem.numDislikes);
                }
                if (window.selItem['userDisliked'] === false) {
                    $(".dislike2.grey2").attr("class", 'opinionBucket dislike2 grey2');
                    $(".dislike2.blue").attr("class", 'opinionBucket dislike2 blue hide');
                    $(".dripp2").attr("class", 'opinionBucket dripp2');
                    $(".down2").html(window.selItem.numDislikes);
                }
                if (window.selItem['userReadItLater']) {
                    $(".readLater2.grey2").attr("class", 'opinionBucket readLater2 grey2 hide');
                    $(".readLater2.blue").attr("class", 'opinionBucket readLater2 blue');
                    $(".dripp2").attr("class", 'opinionBucket dripp2');
                }
                if (window.selItem['userReadItLater'] === false) {
                    $(".readLater2.grey2").attr("class", 'opinionBucket readLater2 grey2');
                    $(".readLater2.blue").attr("class", 'opinionBucket readLater2 blue hide');
                    $(".dripp2").attr("class", 'opinionBucket dripp2');
                }
            }
            
            for (var ii = 0; ii < dripps_data.length; ii++) {
                if (moment().format('MMMM Do YYYY') === moment(dripps_data[ii]['timeSent']).format('MMMM Do YYYY')) {
                    dripps_data[ii]['timeSent'] = "Today, " + moment(dripps_data[ii]['timeSent']).format('h:mm a');
                }
                else {
                    dripps_data[ii]['timeSent'] = moment(dripps_data[ii]['timeSent']).format('MMMM Do, h:mm a');
                }
            }

            sendList = [];
            receiveList = [];
            for (var jj = 0; jj < dripps_data.length; jj++) {
                if (dripps_data[jj]["inInbox"]) {
                    receiveList.push(dripps_data[jj]);
                } 
                if (dripps_data[jj]["isSender"]) {
                    sendList.push(dripps_data[jj]);

                }
                    
            }

            if (receiveList.length == 0 ) {
                $(".noDrippsMain").attr("class", "noDrippsMain");
                var templateSource = $("#items-template").html(),
                template = Handlebars.compile(templateSource),
                itemHTML = template({"buckets":[]});
                $('#items').html(itemHTML);
                $('.mainItemDiv').text('You have nothing in this bucket.');
            }
            else{
                feed = receiveList;
                window.selItem = feed[0];
                var convo = [];
                var convoId = feed[0]['conversationId'];
                for (var i=0;i<conversation_data.length;i++) {
                    if (convoId == conversation_data[i]['conversationId']) {
                        convo.push(conversation_data[i]);
                    }
                }
                for (var ii = 0; ii < convo.length; ii++) {
                    if (moment().format('MMMM Do YYYY') === moment(convo[ii]['time']).format('MMMM Do YYYY')) {
                        convo[ii]['time'] = "Today, " + moment(convo[ii]['time']).format('h:mm a');
                    }
                    else {
                        convo[ii]['time'] = moment(convo[ii]['time']).format('dddd MMMM Do YYYY, h:mm a');
                    }
                }

                var templateSource = $("#items-template").html(),
                template = Handlebars.compile(templateSource),
                itemHTML = template({"buckets":feed});
                $('#items').html(itemHTML);

                for (var ii = 0; ii < feed.length; ii++) {
                    if (feed[ii]['isRead']) {
                        $("[message_id='" + feed[ii]['id'] + "']").css("background", "#DFE0E0");
                    }
                }
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
                    feed = receiveList;
                    $(".selBucket").attr("class", "selBucket");
                    $(e.target).attr("class", "selBucket selectedBucket");
                }

                if ($(e.target).attr('bucketIdentifier') === 'sent') {
                    feed = sendList;
                    $(".selBucket").attr("class", "selBucket");
                    $(e.target).attr("class", "selBucket selectedBucket");
                }

                if ($(e.target).attr('bucketIdentifier') === 'readItLater') {
                    feed = readItLater_data;
                    $(".selBucket").attr("class", "selBucket");
                    $(e.target).attr("class", "selBucket selectedBucket");
                }

                templateSource = $("#items-template").html(),
                template = Handlebars.compile(templateSource),
                itemHTML = template({"buckets":feed});
                
                $('#items').html(itemHTML);
                if (feed.length == 0 ) {
                    $('.mainItemDiv').text('You have nothing in this bucket.');
                } else {
                    $(".noDrippsMain").attr("class", "noDrippsMain hide");
                }

                if ( ($(e.target).attr('bucketIdentifier') === 'dripps') || ($(e.target).attr('bucketIdentifier') === 'sent')) {
                
                var templateSource = $("#selDripp-template").html(),
                messageListTemplate = Handlebars.compile(templateSource);
                    
                    if (feed.length > 0) {
                        window.selItem = feed[0];
                        console.log(conversation_data);
                        displayConvos(window.selItem, window.selItem["conversationId"], messageListTemplate, conversation_data);
                        bindButtons();
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
        $(".up2").text(window.selItem.numLikes);
        $(".down2").text(window.selItem.numDislikes);
        $.ajax({
            url:'http://localhost:5000/isRead',
            data: {drippId: id},
            type:'get'
        });
        $('.messageItem').css("background", "white");
        $('.messageItem').css("color", "#6D6E70");
        $(e.target).closest('.messageItem').css("background", "#6D6E70");
        $(e.target).closest('.messageItem').css("color", "white");
        displayConvos(window.selItem, $(e.target).attr('conversation_id'), template, conversation_data);   
        bindButtons();
    });
}

function bindButtons(){
    window.setBucketLikes();
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

    
}

function displayConvos(selItem, convoId, template, conversation_data){
    convo = [];    
    for (var i=0;i<conversation_data.length;i++) {
        if (convoId == conversation_data[i]['conversationId']) {
            convo.push(conversation_data[i]);
        }
    }
    for (var ii = 0; ii < convo.length; ii++) {
        if (moment().format('MMMM Do YYYY') === moment(convo[ii]['time']).format('MMMM Do YYYY')) {
            convo[ii]['time'] = "Today, " + moment(convo[ii]['time']).subtract('hours', 4).format('h:mm a');
        }
        else {
            convo[ii]['time'] = moment(convo[ii]['time']).subtract('hours', 4).format('dddd MMMM Do YYYY, h:mm a');
        }
    }

    var drippsHTML = template({"selItem":window.selItem, "messages":convo});
    $('#selDripp').html(drippsHTML);
    $('.indMess.' + window.myID).attr("class", "indMess ownMess " + window.myID);
}

window.bindBucket = function() {
    $(".like2").click(function(){
        var articleId = window.selItem['articleId'];
        if($('.like2.grey2').hasClass('hide')) {
            console.log('flsdfj1');
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
            console.log('flsdfj2');
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
}

