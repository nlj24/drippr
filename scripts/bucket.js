var bucket_results;

var feed; 

window.BUCKET_METHOD = {

    compileBuckets:function(dripps_data, readItLater_data, conversation_data){
        window.notifications = 0;
        window.dripps_data_dict = {};
        for (var ii = 0; ii <dripps_data.length; ii++) {
            window.dripps_data_dict[dripps_data[ii].id] = dripps_data[ii];
            if (dripps_data[ii]['unreadComments'] || dripps_data[ii]['unreadDripps']) {
                window.notifications +=1;
            }
            if (dripps_data[ii].recipientGroup != -1) {
                dripps_data[ii].fullName = window.groupListDict2[dripps_data[ii].recipientGroup] + ": " + dripps_data[ii].fullName;
            }
        }

        if (window.notifications) {
            $(".notify").text(window.notifications);
            $(".notify").parents(".headBub").css("background-color", "red");
        }else{
            $(".notify").text("");
            $(".notify").parents(".headBub").css("background-color", "#6D6E70");

        }

        articleDict = {};
        for (var i =0; i < conversation_data.length;i++) {
            conversation_data[i]["isMe"] = (conversation_data[i]["userId"] == window.myID);
            conversation_data[i]["time"] = moment(moment(conversation_data[i]["time"]).format("YYYY MM DD H:mm:ss") + " +0000");
        };
        window.conversation_data = conversation_data;

        window.setBucketLikes = function correctLikes() {

            $(".up2").show();
            $(".down2").show();

            if (articleDict[window.selItem.articleId]['userLiked']) {
                $(".like2.grey2").attr("class", 'opinionBucket like2 grey2 hide');
                $(".like2.blue").attr("class", 'opinionBucket like2 blue');
                $(".dripp2").attr("class", 'opinionBucket dripp2');
                $(".up2").html(articleDict[window.selItem.articleId].numLikes);
            }
            if (articleDict[window.selItem.articleId]['userLiked'] === false) {
                $(".like2.grey2").attr("class", 'opinionBucket like2 grey2');
                $(".like2.blue").attr("class", 'opinionBucket like2 blue hide');
                $(".dripp2").attr("class", 'opinionBucket dripp2');
                $(".up2").html(articleDict[window.selItem.articleId].numLikes);
            }
            if (articleDict[window.selItem.articleId]['userDisliked']) {
                $(".dislike2.grey2").attr("class", 'opinionBucket dislike2 grey2 hide');
                $(".dislike2.blue").attr("class", 'opinionBucket dislike2 blue');
                $(".dripp2").attr("class", 'opinionBucket dripp2');
                $(".down2").html(articleDict[window.selItem.articleId].numDislikes);
            }
            if (articleDict[window.selItem.articleId]['userDisliked'] === false) {
                $(".dislike2.grey2").attr("class", 'opinionBucket dislike2 grey2');
                $(".dislike2.blue").attr("class", 'opinionBucket dislike2 blue hide');
                $(".dripp2").attr("class", 'opinionBucket dripp2');
                $(".down2").html(articleDict[window.selItem.articleId].numDislikes);
            }
            if (articleDict[window.selItem.articleId]['userReadItLater']) {
                $(".readLater2.grey2").attr("class", 'opinionBucket readLater2 grey2 hide');
                $(".readLater2.blue").attr("class", 'opinionBucket readLater2 blue');
                $(".dripp2").attr("class", 'opinionBucket dripp2');
            }
            if (articleDict[window.selItem.articleId]['userReadItLater'] === false) {
                $(".readLater2.grey2").attr("class", 'opinionBucket readLater2 grey2');
                $(".readLater2.blue").attr("class", 'opinionBucket readLater2 blue hide');
                $(".dripp2").attr("class", 'opinionBucket dripp2');
            }

            if (window.readItLater) {
                $(".readLater2.grey2").attr("class", 'opinionBucket readLater2 grey2 hide');
                $(".readLater2.blue").attr("class", 'opinionBucket readLater2 blue hide');
            }
        }

        for (var ii = 0; ii < readItLater_data.length; ii++) {
            var curItem = readItLater_data[ii];
            

                curItem["dateAdded"] = moment(moment(curItem["dateAdded"]).format("YYYY MM DD H:mm:ss") + " +0000");
                if (moment().format('MMMM Do YYYY') === curItem['dateAdded'].format('MMMM Do YYYY')) {
                    curItem['dateAddedString'] = "Today, " + curItem['dateAdded'].format('h:mma');
                }
                else {
                    curItem['dateAddedString'] = curItem['dateAdded'].format('MMMM Do, h:mma');
                }
               

             }

        for (var ii = 0; ii < dripps_data.length; ii++) {

           

            dripps_data[ii]["timeSent"] = moment(moment(dripps_data[ii]["timeSent"]).format("YYYY MM DD H:mm:ss") + " +0000");
            dripps_data[ii]["date"] = moment(moment(dripps_data[ii]["date"]).format("YYYY MM DD H:mm:ss") + " +0000");
            if (moment().format('MMMM Do YYYY') === dripps_data[ii]['timeSent'].format('MMMM Do YYYY')) {
                dripps_data[ii]['timeSentString'] = "Today, " + dripps_data[ii]['timeSent'].format('h:mma');
            }
            else {
                dripps_data[ii]['timeSentString'] = dripps_data[ii]['timeSent'].format('MMMM Do, h:mma');
            }
            if (moment().format('MMMM Do YYYY') === dripps_data[ii]['date'].format('MMMM Do YYYY')) {
                dripps_data[ii]['dateString'] = " - " + "Today, " + dripps_data[ii]['date'].format('h:mma');
            }
            else {
                dripps_data[ii]['dateString'] = " - " + dripps_data[ii]['date'].format('MMMM Do, h:mma');
            }
            if (!dripps_data[ii]['collected']) {
                dripps_data[ii]['chrome'] = "sent via chrome ext";
            }
            if (dripps_data[ii]['date']._i == 'Invalid date +0000'){
                dripps_data[ii]['dateString'] = "";
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
            articleDict[dripps_data[jj]['articleId']] = dripps_data[jj];
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
                if (moment().format('MMMM Do YYYY') === convo[ii]['time'].format('MMMM Do YYYY')) {
                    convo[ii]['timeString'] = "Today, " + convo[ii]['time'].format('h:mma');
                }
                else {
                    convo[ii]['timeString'] = convo[ii]['time'].format('MMMM Do YYYY, h:mma');
                }
            }

            window.dripps_data_dict[window.selItem.id]['unreadDripps'] = 0;
            window.dripps_data_dict[window.selItem.id]['unreadComments'] = 0;

            window.notifications = 0;
            for (var message_id in window.dripps_data_dict) {
                if (window.dripps_data_dict[message_id]['unreadComments'] || window.dripps_data_dict[message_id]['unreadDripps']) {
                    window.notifications +=1;
                }
               
            }
            if (window.notifications) {
                $(".notify").text(window.notifications);
                $(".notify").parents(".headBub").css("background-color", "red");
            }else{
                $(".notify").text("");
                $(".notify").parents(".headBub").css("background-color", "#6D6E70");

            }



            var templateSource = $("#items-template").html(),
            template = Handlebars.compile(templateSource),
            itemHTML = template({"buckets":feed});
            $('#items').html(itemHTML);

            $(".mainItemDiv").css("height",""+ ($(window).height()-136));

            for (var ii = 0; ii < feed.length; ii++) {
                if (feed[ii]['unreadDripps']) {
                    $("[message_id='" + feed[ii]['id'] + "'].messageItem").addClass("unreadDripps");
                }
                if (feed[ii]['unreadComments']) {
                    $("[message_id='" + feed[ii]['id'] + "'].messageItem").addClass("unreadComments");
                }
            }
            var templateSource = $("#selDripp-template").html(),
            messageListTemplate = Handlebars.compile(templateSource),
            drippsHTML = messageListTemplate({"selItem":window.selItem, "messages":convo, "friendNames":makeUserNameList(window.selItem.recipientFriendIds)});
            $('#selDripp').html(drippsHTML);

            if ($("#conversation").height() > ($(window).height()-267-$(".friendPics").height())) {
                 $("#conversation").css("max-height",""+ .4*($(window).height()-160-$(".friendPics").height())+ "px");
                $("#imageDivBucket").css("height",""+ ($(window).height()-267-$(".friendPics").height()-$("#conversation").height()));
                $("#imageDivBucket").css("line-height",""+ ($(window).height()-267-$(".friendPics").height()-$("#conversation").height())+ "px");
            }
            else {
                $("#conversation").css("max-height",""+ .4*($(window).height()-160-$(".friendPics").height())+ "px");
                $("#imageDivBucket").css("max-height",""+ .4*($(window).height()-267-$(".friendPics").height())+ "px");
                $("#imageDivBucket").css("line-height","" + $("#imageDivBucket").height() + "px");
            }

            $('.indMess.' + window.myID).attr("class", "indMess ownMess " + window.myID);          
            bindMessages(messageListTemplate, conversation_data);     
            bindButtons();
            window.setBucketLikes();
        }

        $("[message_id=" + feed[0].id + "].messageItem").addClass("selMessageItem");

        window.readItLater = false;
        $('.selBucket').click(function(e){

            $('#selItem').html("");
            $('#selDripp').html("");


            if ($(e.target).attr('bucketIdentifier') === 'dripps') {
                feed = receiveList;
                $(".selBucket").attr("class", "selBucket");
                $(e.target).attr("class", "selBucket selectedBucket");
                window.resetFB();
                window.readItLater = false;
            }

            if ($(e.target).attr('bucketIdentifier') === 'sent') {
                feed = sendList;
                $(".selBucket").attr("class", "selBucket");
                $(e.target).attr("class", "selBucket selectedBucket");
                window.resetFB();
                window.readItLater = false;
            }

            if ($(e.target).attr('bucketIdentifier') === 'readItLater') {
                feed = readItLater_data;
                $(".selBucket").attr("class", "selBucket");
                $(e.target).attr("class", "selBucket selectedBucket");
                window.resetFB();
                window.readItLater = true;

            }

            templateSource = $("#items-template").html(),
            template = Handlebars.compile(templateSource),
            itemHTML = template({"buckets":feed});
            
            $('#items').html(itemHTML);
            $(".mainItemDiv").css("height",""+ ($(window).height()-136));

            if (feed.length == 0 ) {
                $('.mainItemDiv').text('You have nothing in this bucket.');
                 $(".like2.grey2").attr("class", 'opinionBucket like2 grey2 hide');
                    $(".like2.blue").attr("class", 'opinionBucket like2 blue hide');
                    $(".dislike2.grey2").attr("class", 'opinionBucket dislike2 grey2 hide');
                    $(".dislike2.blue").attr("class", 'opinionBucket dislike2 blue hide');
                    $(".dripp2").attr("class", 'opinionBucket dripp2 hide');
                    $(".readLater2.grey2").attr("class", 'opinionBucket readLater2 grey2 hide');
                    $(".readLater2.blue").attr("class", 'opinionBucket readLater2 blue hide');
                    $(".up2").hide();
                    $(".down2").hide();

            } else {
                $(".noDrippsMain").attr("class", "noDrippsMain hide");
            }

            if ( !(window.readItLater)) {
            
            var templateSource = $("#selDripp-template").html(),
            messageListTemplate = Handlebars.compile(templateSource);
                
                if (feed.length > 0) {
                    window.selItem = feed[0];
                    displayConvos(window.selItem, window.selItem["conversationId"], messageListTemplate, conversation_data);
                    bindButtons();
                }

            }

            if (window.readItLater) {

                if (feed.length > 0) {
                    window.selItem = feed[0];
                }

                var templateSource = $("#selItem-template").html(),
                messageListTemplate = Handlebars.compile(templateSource),
                readItLaterHTML = messageListTemplate({"selItem":window.selItem});
                $('#selDripp').html(readItLaterHTML);
                window.setBucketLikes();

                $('.messageItem').click(function(e){
                    $('.messageItem').removeClass("selMessageItem");
                    window.resetFB();
                    var id = $(e.target).attr('saved_id');
                    for (var i=0;i<feed.length;i++) {
                        if ((id == feed[i]['id']) && feed[i]['isReadItLater']) {
                            window.selItem = feed[i];
                            break;
                        }
                    }
                    readItLaterHTML = messageListTemplate({"selItem":window.selItem});
                    $('#selDripp').html(readItLaterHTML);
                    window.setBucketLikes();

                    $(".up2").text(window.selItem.numLikes);
                    $(".down2").text(window.selItem.numDislikes);
                    
                    $(e.target).closest('.messageItem').removeClass("unSelMessageItem");
                    $(e.target).closest('.messageItem').addClass("selMessageItem");


                });
                
                $("[saved_id=" + feed[0].id + "].messageItem").addClass("selMessageItem");

            }else{

                bindMessages(messageListTemplate, conversation_data);
                $("[message_id=" + feed[0].id + "].messageItem").addClass("selMessageItem");
            }

            console.log(window.selItem);
        });

        $('#messageInput').elastic();

        $(".drippsBub").click(function() {
            window.location = "#dripp";
        });

        $(".bucketsBub").click(function() {
            window.location = "#bucket";
        });

        $(".groupsBub").click(function() {
            window.location = "#group";
        });

    },

    handlerData2:function(dripps_data, readItLater_data){


        $.ajax({
            // url:'json/articles.json',
            url: window.address + 'conversations',
            data: {user: window.myID},
            method:'get',
            success: function(data2){
                for (var i = 0; i < data2.length; i++) {
                    if (window.myID == data2[i].userId) {
                        data2[i].fullName = "me";
                    }
                }
                BUCKET_METHOD.compileBuckets(dripps_data, readItLater_data, data2);
            }
        });

    },

    handlerData:function(dripps_data){
        $.ajax({
            // url:'json/articles.json',
            url: window.address + 'buckets',
            data: {user: window.myID},
            method:'get',
            success: function(data){
                console.log(data);
                BUCKET_METHOD.handlerData2(dripps_data, data);
            }
        });

    },

    loadArticleData : function(){

        $.ajax({
            // url:'json/articles.json',
            url: window.address + 'dripps',
            data: {user: window.myID},
            method:'get',
            success: function(data) {
                window.BUCKET_METHOD.handlerData(data.article);
                window.userNames = {};
                for (var jj = 0; jj < data.names.length; jj++) {
                    window.userNames[data.names[jj].id] = data.names[jj]['fullName'];
                }
            }
        });
    },
};

function bindMessages(template, conversation_data){
    $('.messageItem').click(function(e){
        $('.messageItem').removeClass("selMessageItem");
        window.resetFB();
        var id = $(e.target).attr('message_id');
        for (var i=0;i<feed.length;i++) {
            if ((id == feed[i]['id']) && !(feed[i]['isReadItLater'])) {
                window.selItem = feed[i];
            }
        }
        $(".up2").text(window.selItem.numLikes);
        $(".down2").text(window.selItem.numDislikes);
        $.ajax({
            url: window.address + 'isRead',
            data: {drippId: id},
            type:'get'
        });

        window.dripps_data_dict[id]['unreadDripps'] = 0;
        window.dripps_data_dict[id]['unreadComments'] = 0;

        window.notifications = 0;
        for (var message_id in window.dripps_data_dict) {
            if (window.dripps_data_dict[message_id]['unreadComments'] || window.dripps_data_dict[message_id]['unreadDripps']) {
                window.notifications +=1;
            }
           
        }
        if (window.notifications) {
            $(".notify").text(window.notifications);
            $(".notify").parents(".headBub").css("background-color", "red");
        }else{
            $(".notify").text("");
            $(".notify").parents(".headBub").css("background-color", "#6D6E70");

        }



        $(e.target).closest('.messageItem').removeClass("unSelMessageItem");
        $(e.target).closest('.messageItem').addClass("selMessageItem");
        $(e.target).closest('.messageItem').removeClass("unreadDripps");
        $(e.target).closest('.messageItem').removeClass("unreadComments");

        displayConvos(window.selItem, $(e.target).attr('conversation_id'), template, conversation_data);   

        bindButtons();
    });
}

function bindButtons(){
    window.setBucketLikes();
    $("#messageSend").click(function(){
        content = $('#messageInput').val();
        for (var i = 0; i < content.length; i++) {
            if(content[i] == "\"") {
                var content = content.substring(0, i) + "'" + content.substring(i+1);
            }
        }
        
        if (content !== '') {
            $.ajax({
                url: window.address + 'sendConvo',
                data: {conversationId: window.selItem['conversationId'], userId: window.myID, content: content},
                type:'get'
            });
            $('#messageInput').val('');
            var templateSource = $("#selDripp-template").html(),
            messageListTemplate = Handlebars.compile(templateSource);
            window.conversation_data.push({content: content, conversationId: window.selItem['conversationId'], fullName:"me", userId:window.myID, time:moment()});

            displayConvos(window.selItem, window.selItem['conversationId'], messageListTemplate, window.conversation_data);
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
        if (moment().format('MMMM Do YYYY') === convo[ii]['time'].format('MMMM Do YYYY')) {
            convo[ii]['timeString'] = "Today, " + convo[ii]['time'].format('h:mma');
        }
        else {
            convo[ii]['timeString'] = convo[ii]['time'].format('MMMM Do YYYY, h:mma');
        }
    }

    var drippsHTML = template({"selItem":window.selItem, "messages":convo, "friendNames":makeUserNameList(window.selItem.recipientFriendIds)});
    $('#selDripp').html(drippsHTML);
    $('.indMess.' + window.myID).attr("class", "indMess ownMess " + window.myID);
    bindButtons();
    if ($("#conversation").height() > ($(window).height()-267-$(".friendPics").height())) {
        $("#conversation").css("max-height",""+ .4*($(window).height()-160-$(".friendPics").height())+ "px");
        $("#imageDivBucket").css("height",""+ ($(window).height()-267-$(".friendPics").height()-$("#conversation").height()));
        $("#imageDivBucket").css("line-height",""+ ($(window).height()-267-$(".friendPics").height()-$("#conversation").height())+ "px");
    }
    else {
        $("#conversation").css("max-height",""+ .4*($(window).height()-160-$(".friendPics").height())+ "px");
        $("#imageDivBucket").css("max-height",""+ .4*($(window).height()-267-$(".friendPics").height())+ "px");
        $("#imageDivBucket").css("line-height","" + $("#imageDivBucket").height() + "px");
    }
}

window.bindBucket = function() {
    $(".like2").click(function(){
        var articleId = window.selItem['articleId'];
        if($('.like2.grey2').hasClass('hide')) {
            $(".up2").text(--articleDict[window.selItem.articleId].numLikes);
            $(".like2.grey2").attr("class", 'opinionBucket like2 grey2');
            $(".like2.blue").attr("class", 'opinionBucket like2 blue hide');
            $.ajax({
                url: window.address + 'removeLikes',
                data: {user: window.myID, article: articleId},
                type:'get'
            });
            articleDict[window.selItem.articleId]['userLiked'] = false;
            return;
        };

        if ($(".dislike2.grey2").hasClass("hide")) {
            $(".dislike2.grey2").attr("class", 'opinionBucket dislike2 grey2');
            $(".dislike2.blue").attr("class", 'opinionBucket dislike2 blue hide');
            $(".down2").text(--articleDict[window.selItem.articleId].numDislikes);
            $.ajax({
                url: window.address + 'removeDislikes',
                data: {user: window.myID, article: articleId},
                type:'get'
            });
            articleDict[window.selItem.articleId]['userLiked'] = true;
            articleDict[window.selItem.articleId]['userDisliked'] = false;                
        };
        if($('.like2.blue').hasClass('hide')) {
            $(".up2").text(++articleDict[window.selItem.articleId].numLikes);
            $(".like2.grey2").attr("class", 'opinionBucket like2 grey2 hide')
            $(".like2.blue").attr("class", 'opinionBucket like2 blue');
            $.ajax({
                url: window.address + 'likes',
                data: {user: window.myID, article: articleId},
                type:'get'
            });
            articleDict[window.selItem.articleId]['userLiked'] = true;
        };
    });

    $(".dislike2").click(function(){
        var articleId = articleDict[window.selItem.articleId]['articleId'];
        if($('.dislike2.grey2').hasClass('hide')) {
            $(".down2").text(--articleDict[window.selItem.articleId].numDislikes);
            $(".dislike2.grey2").attr("class", 'opinionBucket dislike2 grey2');
            $(".dislike2.blue").attr("class", 'opinionBucket dislike2 blue hide');
            $.ajax({
                url: window.address + 'removeDislikes',
                data: {user: window.myID, article: articleId},
                type:'get'
            }); 
            articleDict[window.selItem.articleId]['userDisliked'] = false;
            return;
        };

        if ($(".like2.grey2").hasClass("hide")) {
            $(".like2.grey2").attr("class", 'opinionBucket like2 grey2');
            $(".like2.blue").attr("class", 'opinionBucket like2 blue hide');
            $(".up2").text(--articleDict[window.selItem.articleId].numLikes);
            $.ajax({
                url: window.address + 'removeLikes',
                data: {user: window.myID, article: articleId},
                type:'get'
            });
            articleDict[window.selItem.articleId]['userLiked'] = false;
            articleDict[window.selItem.articleId]['userDisliked'] = true;
        };

        if($('.dislike2.blue').hasClass('hide')) {
            $(".down2").text(++articleDict[window.selItem.articleId].numDislikes);
            $(".dislike2.grey2").attr("class", 'opinionBucket dislike2 grey2 hide');
            $(".dislike2.blue").attr("class", 'opinionBucket dislike2 blue');
            $.ajax({
                url: window.address + 'dislikes',
                data: {user: window.myID, article: articleId},
                type:'get'
            });
            articleDict[window.selItem.articleId]['userDisliked'] = true;
        };
    });

    $(".readLater2").click(function(){
        var articleId = articleDict[window.selItem.articleId]['articleId'];
        if($('.readLater2.grey2').hasClass('hide')) {
            $(".readLater2.grey2").attr("class", 'opinionBucket readLater2 grey2');
            $(".readLater2.blue").attr("class", 'opinionBucket readLater2 blue hide');
            $.ajax({
                url: window.address + 'removeReadItLater',
                data: {userId: window.myID, name: "readLater", articleId: articleId, dateAdded: "2014-04-29 17:12:58", bucketId: 2},
                type:'get'
            });
            articleDict[window.selItem.articleId]['userReadItLater'] = false;
            return;
        }
        if($('.readLater2.blue').hasClass('hide')) {
            $(".readLater2.grey2").attr("class", 'opinionBucket readLater2 grey2 hide');
            $(".readLater2.blue").attr("class", 'opinionBucket readLater2 blue');
            $.ajax({
                url: window.address + 'readItLater',
                data: {userId: window.myID, name: "readLater", articleId: articleId, bucketId: 2},
                type:'get'
            });
            articleDict[window.selItem.articleId]['userReadItLater'] = true;
        }
    });

    $(".dripp2").click(function(){
        window.articleSendId = window.selItem['articleId'];
        $(".showForm").attr("class", "showForm");
        $(".success").attr("class", "success hide");
    });
}

function makeUserNameList(recIds) {
    var list = recIds.split(',');
    list.push(window.selItem.fromUserId);
    for (var zz = 0; zz < list.length; zz++) {

        list[zz] = {name:window.userNames[list[zz]], picture: "http://graph.facebook.com/" + list[zz] + "/picture?width=25&height=25"};
    }



    return list;
}
