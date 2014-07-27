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
        };

        window.conversation_data = conversation_data;

        window.setBucketLikes = function correctLikes() {

            $(".up2").show();
            $(".down2").show();
            if (feed) {
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
        }

         for (var ii = 0; ii < readItLater_data.length; ii++) {
            if (Date.create().format('{M}{d}{yy}') == Date.create(readItLater_data[ii]["dateAdded"]).format('{M}{d}{yy}')) {
                readItLater_data[ii]["dateAddedString"] = "Today, " + Date.create(readItLater_data[ii]["dateAdded"]).format('{12hr}:{mm}{tt}');
            }
            else {
               readItLater_data[ii]["dateAddedString"] = Date.create(readItLater_data[ii]["dateAdded"]).format('{Month} {ord}, {12hr}:{mm}{tt}');
            }
            if (Date.create().format('{M}{d}{yy}') == Date.create(readItLater_data[ii]["date"]).format('{M}{d}{yy}')) {
                readItLater_data[ii]["dateReadString"] = " - Today, " + Date.create(readItLater_data[ii]["date"]).format('{12hr}:{mm}{tt}');
            }
            else {
               readItLater_data[ii]["dateReadString"] = " - " + Date.create(readItLater_data[ii]["date"]).format('{Month} {ord}, {12hr}:{mm}{tt}');
            }
            if (Date.create(readItLater_data[ii]["date"]).format('{yy}') == '-1') {
                readItLater_data[ii]['dateReadString'] = "";
            }
        }

        for (var ii = 0; ii < dripps_data.length; ii++) {

            if (Date.create().format('{M}{d}{yy}') == Date.create(dripps_data[ii]["timeSent"]).format('{M}{d}{yy}')) {
                dripps_data[ii]["timeSentString"] = "Today, " + Date.create(dripps_data[ii]["timeSent"]).format('{12hr}:{mm}{tt}');
            }
            else {
               dripps_data[ii]["timeSentString"] = Date.create(dripps_data[ii]["timeSent"]).format('{Month} {ord}, {12hr}:{mm}{tt}');
            }
            if (Date.create().format('{M}{d}{yy}') == Date.create(dripps_data[ii]["date"]).format('{M}{d}{yy}')) {
                dripps_data[ii]["dateString"] = " - Today, " + Date.create(dripps_data[ii]["date"]).format('{12hr}:{mm}{tt}');
            }
            else {
               dripps_data[ii]["dateString"] = " - " + Date.create(dripps_data[ii]["date"]).format('{Month} {ord}, {12hr}:{mm}{tt}');
            }

            if (!dripps_data[ii]['collected']) {
                dripps_data[ii]['chrome'] = "sent via chrome ext";
            }
            if (Date.create(dripps_data[ii]["date"]).format('{yy}') == '-1') {
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

        for (var kk = 0; kk < readItLater_data.length; kk++) {
            articleDict[readItLater_data[kk]['articleId']] = readItLater_data[kk];

        }

        if (receiveList.length == 0 ) {
            var templateSource = $("#items-template").html(),
            template = Handlebars.compile(templateSource),
            itemHTML = template({"buckets":[]});
            $('#items').html(itemHTML);
            $('.mainItemDiv').text(' you have nothing in this bucket.');
        }
        else{
            $('.noDrippsMain').attr("class", "noDrippsMain hide");
            feed = receiveList;
            window.selItem = feed[0];
            window.firstID = feed[0].id;
            var convo = [];
            var convoId = feed[0]['conversationId'];
            for (var i=0;i<conversation_data.length;i++) {
                if (convoId == conversation_data[i]['conversationId']) {
                    convo.push(conversation_data[i]);
                }
            }
            for (var ii = 0; ii < convo.length; ii++) {

                if (Date.create().format('{M}{d}{yy}') == Date.create(convo[ii]["time"]).format('{M}{d}{yy}')) {
                    convo[ii]["timeString"] = "Today, " + Date.create(convo[ii]["time"]).format('{12hr}:{mm}{tt}');
                }
                else {
                   convo[ii]["timeString"] = Date.create(convo[ii]["time"]).format('{Month} {ord}, {12hr}:{mm}{tt}');
                }
            }
        
            

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

            setTimeout(function() {
                if ((location.hash == "#bucket") && (window.selItem.id == window.firstID)) {
                    if ((window.dripps_data_dict[window.selItem.id]['unreadDripps']) || (window.dripps_data_dict[window.selItem.id]['unreadComments'])) {
                        window.notifications -= 1;
                        window.dripps_data_dict[window.selItem.id]['unreadDripps'] = 0;
                        window.dripps_data_dict[window.selItem.id]['unreadComments'] = 0;
                        $("[message_id='" + firstID + "']").removeClass("unreadDripps");
                        $("[message_id='" + firstID + "']").removeClass("unreadComments");
                        $.ajax({
                            url: window.address + 'isRead',
                            data: {drippId: firstID},
                            type:'get'
                        });
                        if (window.notifications) {
                            $(".notify").text(window.notifications);
                        }else{
                            $(".notify").text("");
                        }
                    }
                    
                }
            }, 3500);

            $(".mainItemDiv").css("height",""+ ($(window).height()-136));

            for (var ii = 0; ii < feed.length; ii++) {
                if (feed[ii]['unreadComments']) {
                    $("[message_id='" + feed[ii]['id'] + "'].messageItem").addClass("unreadComments");
                }
                if (feed[ii]['unreadDripps']) {
                    $("[message_id='" + feed[ii]['id'] + "'].messageItem").addClass("unreadDripps");
                    $("[message_id='" + feed[ii]['id'] + "'].messageItem").removeClass("unreadComments");
                }
            }
            var templateSource = $("#selDripp-template").html(),
            messageListTemplate = Handlebars.compile(templateSource),
            drippsHTML = messageListTemplate({"selItem":window.selItem, "messages":convo, "friendNames":makeUserNameList(window.selItem.recipientFriendIds)});
            $('#selDripp').html(drippsHTML);

            if ($("#conversation").height() > ($(window).height()-267-$(".friendPics").height())) {
                $("#conversation").css("max-height",""+ .4*($(window).height()-145-$(".friendPics").height())+ "px");
                $("#imageDivBucket").css("height",""+ ($(window).height()-277-$(".friendPics").height()-$("#conversation").height()));
                $("#imageDivBucket").css("line-height",""+ ($(window).height()-277-$(".friendPics").height()-$("#conversation").height())+ "px");
            }
            else {
                $("#conversation").css("max-height",""+ .4*($(window).height()-145-$(".friendPics").height())+ "px");
                $("#imageDivBucket").css("max-height",""+ .4*($(window).height()-277-$(".friendPics").height())+ "px");
                $("#imageDivBucket").css("line-height","" + $("#imageDivBucket").height() + "px");
            }

            $('.indMess.' + window.myID).attr("class", "indMess ownMess " + window.myID);          
            bindMessages(messageListTemplate, conversation_data);     
            bindButtons();
            window.setBucketLikes();
        }

        if (feed) {
            $("[message_id=" + feed[0].id + "].messageItem").addClass("selMessageItem");
        }

        window.readItLater = false;
        $('.selBucket').click(function(e){

            $('#selItem').html("");
            $('#selDripp').html("");


            if ($(e.target).attr('bucketIdentifier') === 'dripps') {
                feed = receiveList;
                if(!feed.length) {
                    $(".noDrippsMain").attr("class", "noDrippsMain");
                } else {
                     $(".noDrippsMain").attr("class", "noDrippsMain hide");
                }
                $(".selBucket").attr("class", "selBucket");
                $(e.target).attr("class", "selBucket selectedBucket");
                window.resetFB();
                window.readItLater = false;
            }

            if ($(e.target).attr('bucketIdentifier') === 'sent') {
                feed = sendList;
                if(!feed.length) {
                    $(".noDrippsMain").attr("class", "noDrippsMain");
                } else {
                     $(".noDrippsMain").attr("class", "noDrippsMain hide");
                }
                $(".selBucket").attr("class", "selBucket");
                $(e.target).attr("class", "selBucket selectedBucket");
                window.resetFB();
                window.readItLater = false;
            }

            if ($(e.target).attr('bucketIdentifier') === 'readItLater') {
                feed = readItLater_data;
                if(!feed.length) {
                    $(".noDrippsMain").attr("class", "noDrippsMain");
                } else {
                     $(".noDrippsMain").attr("class", "noDrippsMain hide");
                }
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
                $('.mainItemDiv').text(' you have nothing in this bucket.');
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
                

                    var templateSource = $("#selItem-template").html(),
                    messageListTemplate = Handlebars.compile(templateSource),
                    readItLaterHTML = messageListTemplate({"selItem":window.selItem});
                    $('#selDripp').html(readItLaterHTML);
                    window.setBucketLikes();
                }

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
                if (feed.length) {
                    $("[saved_id=" + feed[0].id + "].messageItem").addClass("selMessageItem");
                }

            }else{
                if (feed.length) {
                    bindMessages(messageListTemplate, conversation_data);
                    $("[message_id=" + feed[0].id + "].messageItem").addClass("selMessageItem");
                }
            }

            $('#imageDivRead').css("height",""+ ($(window).height()-186));
        });
    
        if (!feed) {
            $(".noDrippsMain").attr("class", "noDrippsMain");
        }

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
        var content = $('#messageInput').val();
        for (var i = 0; i < content.length; i++) {
            if(content[i] == "\"") {
                content = content.substring(0, i) + "'" + content.substring(i+1);
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
            window.conversation_data.push({content: content, conversationId: window.selItem['conversationId'], fullName:"me", userId:window.myID, time:Date.create()});

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
         if (Date.create().format('{M}{d}{yy}') == Date.create(convo[ii]["time"]).format('{M}{d}{yy}')) {
            convo[ii]["timeString"] = "Today, " + Date.create(convo[ii]["time"]).format('{12hr}:{mm}{tt}');
        }
        else {
           convo[ii]["timeString"] = Date.create(convo[ii]["time"]).format('{Month} {ord}, {12hr}:{mm}{tt}');
        }
    }

    var drippsHTML = template({"selItem":window.selItem, "messages":convo, "friendNames":makeUserNameList(window.selItem.recipientFriendIds)});
    $('#selDripp').html(drippsHTML);
    $('.indMess.' + window.myID).attr("class", "indMess ownMess " + window.myID);
    bindButtons();
    if ($("#conversation").height() > ($(window).height()-277-$(".friendPics").height())) {
        $("#conversation").css("max-height",""+ .4*($(window).height()-145-$(".friendPics").height())+ "px");
        $("#imageDivBucket").css("height",""+ ($(window).height()-277-$(".friendPics").height()-$("#conversation").height()));
        $("#imageDivBucket").css("line-height",""+ ($(window).height()-277-$(".friendPics").height()-$("#conversation").height())+ "px");
    }
    else {
        $("#conversation").css("max-height",""+ .4*($(window).height()-145-$(".friendPics").height())+ "px");
        $("#imageDivBucket").css("max-height",""+ .4*($(window).height()-277-$(".friendPics").height())+ "px");
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
                data: {userId: window.myID, name: "readLater", articleId: articleId, bucketId: 2},
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
