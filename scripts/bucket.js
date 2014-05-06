var bucket_results;

var BUCKET_METHOD ={

        compileBuckets:function(dripps_data, readItLater_data){

            var feed = dripps_data;
            var selItem = []
            selItem.push(feed[0]);


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
                console.log('f');
                selItem = [];
                console.log(feed);
                var id = $(e.target).attr('id');
                for (var i=0;i<feed.length;i++) {
                    if (parseInt(id) === feed[i]['id']) {
                        selItem.push(feed[i]);
                    }
                }
                drippsHTML = template({"selItems":selItem});
                $('#selDripp').html(drippsHTML);
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

        handlerData:function(dripps_data){

            $.ajax({
                // url:'json/articles.json',
                url:'http://localhost:5000/buckets',
                data: {user: 1},
                method:'get',
                success: function(data){
                    BUCKET_METHOD.compileBuckets(dripps_data, data);
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

