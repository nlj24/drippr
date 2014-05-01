var bucket_results;

var BUCKET_METHOD ={

 
        handlerData:function(resJSON){
            bucket_results = resJSON;
            console.log(resJSON);

            var sports = [];
            var world = [];

            for (var i=0;i<resJSON.length;i++) {
                switch (resJSON[i]["category"]) {
                    case "World":
                        world.push(resJSON[i]);
                        break;
                    case "Sports":
                        sports.push(resJSON[i]);
                        break;
                }
            }

            var feed = resJSON;

            var templateSource = $("#bucket-template").html(),
            template = Handlebars.compile(templateSource),
            articleHTML = template({"dripps":feed});
            $('#my-container').html(articleHTML);

            document.getElementById("all").style.background="#82C6ED";

            $("#all").click(function(){
                feed = resJSON;
                articleHTML = template({"articles":feed});
                $('#my-container').html(articleHTML);
                document.getElementById("all").style.background="#82C6ED";
            });

            $("#world").click(function(){
                feed = world;
                articleHTML = template({"articles":feed});
                $('#my-container').html(articleHTML);
                document.getElementById("world").style.background="#82C6ED";
            });

            $("#sports").click(function(){
                feed = sports;
                articleHTML = template({"articles":feed});
                $('#my-container').html(articleHTML);
                document.getElementById("sports").style.background="#82C6ED";
            });
           
            $(".like").click(function(e){
            // e.preventDefault();
                var articleId = $(e.target).attr("article");
                console.log("article results...");
                console.log(article_results);
                console.log(articleId);
                document.getElementById("sports").style.background="#82C6ED";

                $.ajax({
                    url:'http://localhost:5000/likes',
                    data: {user: 1, article: articleId},
                    type:'get',
                    success:function(){
                        console.log('it worked?');
                    }
                });
            });

            $(".dislike").click(function(e){
            // e.preventDefault();
                var articleId = $(e.target).attr("article");
                console.log($(e.target).attr("article"));

                $.ajax({
                    url:'http://localhost:5000/dislikes',
                    data: {user: 1, article: articleId},
                    type:'get',
                    success:function(){
                        console.log('it dis worked?');
                    }
                });
            });

            $(".dripp").click(function(e){
            // e.preventDefault();
                alert("add ability to send");
                //ajax request to add this like, if the user hasn't liked it before
            });

            $(".readLater").click(function(e){
            // e.preventDefault();
                alert("add ability to read later");
                //ajax request to add this like, if the user hasn't liked it before
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

         $.ajax({
                // url:'json/articles.json',
                url:'http://localhost:5000/buckets',
                data: {user: 1},
                method:'get',
                success:this.handlerBucketData
            });
        },
};
 
$(document).ready(function(){
    BUCKET_METHOD.loadArticleData();
});

