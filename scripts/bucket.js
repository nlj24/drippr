var bucket_results;

var BUCKET_METHOD ={

        compileBuckets:function(dripps_data, readItLater_data, conversation_data){

            console.log(dripps_data);
            
            console.log(readItLater_data);
            console.log(conversation_data);
            
            var feed = dripps_data;
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
            template = Handlebars.compile(templateSource),
            drippsHTML = template({"selItems":selItem});
            $('#selDripp').html(drippsHTML);
            drippsHTML = template({"messages":convo});
            $('#messagesDiv').html(drippsHTML);

            $('.selBucket').click(function(e){
                
                if ($(e.target).attr('bucketIdentifier') === 'dripps') {
                    feed = dripps_data;
                    var templateSource = $("#selDripp-template").html(),
                    template = Handlebars.compile(templateSource),
                    drippsHTML = template({"selItems":selItem});
                    $('#selDripp').html(drippsHTML);
                    readItLaterHTML = template();
                    $('#selItem').html(readItLaterHTML);
                }

                if ($(e.target).attr('bucketIdentifier') === 'readItLater') {
                    feed = readItLater_data;
                    var templateSource = $("#selItem-template").html(),
                    template = Handlebars.compile(templateSource),
                    readItLaterHTML = template({"selItems":selItem});
                    $('#selItem').html(readItLaterHTML);
                    drippsHTML = template();
                    $('#selDripp').html(drippsHTML);
                }
                
                templateSource = $("#items-template").html(),
                template = Handlebars.compile(templateSource),
                itemHTML = template({"buckets":feed});
                $('#items').html(itemHTML);
            });

            $('.messageItem').click(function(e){
                selItem = [];
                convo = [];
                var id = $(e.target).attr('id');
                for (var i=0;i<feed.length;i++) {
                    if (parseInt(id) === feed[i]['id']) {
                        selItem.push(feed[i]);
                    }
                }

                var convoId = $(e.target).attr('conversationId');
                for (var i=0;i<conversation_data.length;i++) {
                    if (parseInt(convoId) === conversation_data[i]['conversationId']) {
                        convo.push(conversation_data[i]);
                    }
                }

                drippsHTML = template({"selItems":selItem});
                $('#selDripp').html(drippsHTML);
                drippsHTML = template({"messages":convo});
                $('#messagesDiv').html(drippsHTML);
            });

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

