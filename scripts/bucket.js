var bucket_results;

var BUCKET_METHOD ={

        compileBuckets:function(dripps_data, readItLater_data){

            var feed = dripps_data;
            var selItem = []
            selItem.push(feed[0]);
            
            var templateSource = $("#items-template").html(),
            template = Handlebars.compile(templateSource),
            itemHTML = template({"buckets":feed});
            $('#items').html(itemHTML);

            var templateSource = $("#selItem-template").html(),
            template = Handlebars.compile(templateSource),
            readItLaterHTML = template({"selItems":selItem});
            $('#selItem').html(readItLaterHTML);

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

