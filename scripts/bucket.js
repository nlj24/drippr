var BUCKET_METHOD ={
 
        handlerData:function(resJSON){
            console.log(resJSON);
            
            localStorage.setItem('testObject', JSON.stringify(resJSON));
            var retrievedObject = localStorage.getItem('testObject');
            console.log('retrievedObject: ', JSON.parse(retrievedObject));

            var templateSource   = $("#bucket-template").html(),
                
                template = Handlebars.compile(templateSource),
 
                bucketHTML = template({"buckets":resJSON});
 				console.log(resJSON);
           $('#my-container').html(bucketHTML);
           
           	$(".like").click(function(e){
			// e.preventDefault();
                var articleId = $(e.target).attr("article");
				console.log(articleId);

                $.ajax({
                    url:'http://localhost:5000/likes',
                    data: {user: 1, article: articleId},
                    type:'get',
                    success:function(){
                        console.log('it worked?');
                        
        				//articleHTML = template(data2);
         
                   		//$('#my-container').html(articleHTML);
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
                        
                        //articleHTML = template(data2);
         
                        //$('#my-container').html(articleHTML);
                    }
                });
			});   
        },

        loadBucketData : function(){
 
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
    BUCKET_METHOD.loadBucketData();
});