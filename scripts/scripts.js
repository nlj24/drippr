var ARTICLE_METHOD ={
 
        handlerData:function(resJSON){
            console.log(resJSON);
            localStorage.setItem('testObject', JSON.stringify(resJSON));
            var retrievedObject = localStorage.getItem('testObject');
            console.log('retrievedObject: ', JSON.parse(retrievedObject));

            var templateSource   = $("#article-template").html(),
 
                template = Handlebars.compile(templateSource),
 
                articleHTML = template({"articles":resJSON});
 
           $('#my-container').html(articleHTML);
           
           	$(".like").click(function(e){
			// e.preventDefault();
                var articleId = $(e.target).attr("article");
				console.log(articleId);
                //ajax request to add this like, if the user hasn't liked it before

                $.ajax({
                    url:'http://localhost:5000/likes',
                    data: {user: 1, article: articleId},
                    type:'post',
                    success:function(){
                        console.log('it worked?');
                    }
                });

				resJSON.articles[0].numLikes++;
				articleHTML = template(resJSON);
 
           		$('#my-container').html(articleHTML);
			});

			$(".dislike").click(function(e){
			// e.preventDefault();
				console.log($(e.target).attr("article"));
				//ajax request to add this like, if the user hasn't liked it before
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
                url:'http://localhost:5000/articles',
                data: {user: 1},
                method:'get',
                success:this.handlerData
            });
        },
};
 
$(document).ready(function(){
    ARTICLE_METHOD.loadArticleData();
});

