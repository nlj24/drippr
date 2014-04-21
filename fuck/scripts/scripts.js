var ARTICLE_METHOD ={
 
        handlerData:function(resJSON){
 
            var templateSource   = $("#article-template").html(),
 
                template = Handlebars.compile(templateSource),
 
                articleHTML = template(resJSON);
 
           $('#my-container').html(articleHTML);
           	$(".like").click(function(e){
			// e.preventDefault();
				console.log($(e.target).attr("article"));
				//ajax request to add this like, if the user hasn't liked it before
				resJSON.articles[0].numLikes++;
				articleHTML = template(resJSON);
 
           		$('#my-container').html(articleHTML);
			});

			$(".dislike").click(function(e){
			// e.preventDefault();
				console.log($(e.target).attr("article"));
				//ajax request to add this like, if the user hasn't liked it before
			});
             
        },
        loadArticleData : function(){
 
            $.ajax({
                url:"/json/articles.json",
                method:'get',
                success:this.handlerData
 
            })
        }
};
 
$(document).ready(function(){
 
    ARTICLE_METHOD.loadArticleData();
});

