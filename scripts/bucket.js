var bucket_results;

var feed; 

window.BUCKET_METHOD = {

        groupData:function(data) {
            console.log(data);

            //(group id -> list of {id:name}?)
            var members_dict = {};
            window.groupList = [];
            for (var jj = 0; jj < data.length; jj++) {

                if (!(members_dict[data[jj].id])) {
                    window.groupList.push(data[jj].name);
                    members_dict[data[jj].id] = {name:data[jj].name, list:[]};  
                }
                    
                id = data[jj].userId;
                userName = data[jj].fName +" " +data[jj].lName ;
                members_dict[data[jj].id]['list'].push({name : userName});
            } 

            console.log(members_dict);


            var templateSource = $("#groups-template").html();
            template = Handlebars.compile(templateSource);
            groupHTML = template({"groups":members_dict});
            $('#groups').html(groupHTML);
        },


        compileBuckets:function(dripps_data, readItLater_data, conversation_data){
            
            feed = dripps_data;
            window.selItem = [];
            window.selItem.push(feed[0]);

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

            $(".bucketsBub").click(function(){
                window.setLikes();
                $("#dripps").attr("class", "container-fluid hide");
                $("#drippsHeader").attr("class", "col-md-5 headingPad hide");
                $("#buckets").attr("class", "container-fluid");
                $("#bucketsHeader").attr("class", "col-md-5 headingPad");


            });

            var templateSource = $("#items-template").html(),
            template = Handlebars.compile(templateSource),
            itemHTML = template({"buckets":feed});
            $('#items').html(itemHTML);

            var templateSource = $("#selDripp-template").html(),
            messageListTemplate = Handlebars.compile(templateSource),
            drippsHTML = messageListTemplate({"selItems":window.selItem});
            $('#selDripp').html(drippsHTML);
            drippsHTML = messageListTemplate({"messages":convo});
            $('#messagesDiv').html(drippsHTML);

            $('.indMess.' + window.myID).attr("class", "indMess ownMess " + window.myID);

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
                    
                window.selItem = [];

                window.selItem.push(feed[0]);

                displayConvos(window.selItem, $("#" + feed[0]['id']).attr("conversation_id"), messageListTemplate, conversation_data);
                }

                if ($(e.target).attr('bucketIdentifier') === 'readItLater') {

                    var templateSource = $("#selItem-template").html(),
                    messageListTemplate = Handlebars.compile(templateSource),
                    readItLaterHTML = messageListTemplate({"selItems":window.selItem});
                    $('#selItem').html(readItLaterHTML);
                    drippsHTML = messageListTemplate();
                    $('#selDripp').html(drippsHTML);
                }

                

                bindMessages(messageListTemplate, conversation_data);
            });
            
            bindMessages(messageListTemplate, conversation_data);     

            $.ajax({
                // url:'json/articles.json',
                url:'http://localhost:5000/groups',
                data: {userId: window.myID},
                method:'get',
                success: this.groupData
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
            if (dripps_data.length == 0) {
                
            }
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
            var id = $(e.target).attr('id');
            window.selItem = [];
            for (var i=0;i<feed.length;i++) {
                    if (id == feed[i]['id']) {
                        window.selItem.push(feed[i]);
                    }
                }

            displayConvos(window.selItem, $(e.target).attr('conversation_id'), template, conversation_data);
            
            });
    
    bindButtons();
}

function bindButtons(){
    $("#messageSend").click(function(){
        content = $('#messageInput').val();
        if (content !== '') {
            $.ajax({
                url:'http://localhost:5000/sendConvo',
                data: {conversationId: window.selItem[0]['conversationId'], userId: window.myID, content: content},
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
    var drippsHTML = template({"selItems":window.selItem});
    $('#selDripp').html(drippsHTML);
    drippsHTML = template({"messages":convo});
    $('#messagesDiv').html(drippsHTML);
    $('.indMess.' + window.myID).attr("class", "indMess ownMess " + window.myID);
}



