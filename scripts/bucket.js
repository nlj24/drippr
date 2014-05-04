var bucket_results;

var BUCKET_METHOD ={

        compileBuckets:function(dripps_data, buckets_data){

            dripps_results = dripps_data;

            bucket_results = buckets_data;
            console.log(buckets_data);

            var feed = buckets_data;

            var templateSource = $("#bucket-template").html(),
            template = Handlebars.compile(templateSource),
            articleHTML = template({"buckets":feed});
            $('#my-container').html(articleHTML);

            $('.messageItem').click(function(e){
                var id = $(e.target);
                console.log(id);
                // feed = articlesData[id];
                // articleHTML = template({"articles":feed});
                // $('#articles').html(articleHTML);
            });
        },

        handlerData:function(dripps_data){

            $.ajax({
                // url:'json/articles.json',
                url:'http://localhost:5000/buckets',
                data: {user: 1},
                method:'get',
                success:this.compileBuckets(dripps_data, buckets_data)
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

