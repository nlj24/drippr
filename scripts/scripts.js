var ARTICLE_METHOD ={
 
        handlerData:function(resJSON){
            localStorage.setItem('testObject', JSON.stringify(resJSON));
            var retrievedObject = localStorage.getItem('testObject');
            console.log('retrievedObject: ', JSON.parse(retrievedObject));

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

        handlerPrefData:function(resJSON){
            localStorage.setItem('prefObject', JSON.stringify(resJSON));
            var PrefObject = localStorage.getItem('prefObject');
            console.log('PrefObject: ', JSON.parse(PrefObject));

            var templateSource   = $("#article-template").html(),
 
                template = Handlebars.compile(templateSource),
 
                prefHTML = template(resJSON);

                $('#my-container').html(prefHTML);
        },

        loadArticleData : function(){
 
            $.ajax({
                url:"/json/articles.json",
                method:'get',
                success:this.handlerData
            })
        },

        loadPrefData : function(){
 
            $.ajax({
                url:"/json/prefs.json",
                method:'get',
                success:this.handlerPrefData
            })
        }
};
 
$(document).ready(function(){
 
    ARTICLE_METHOD.loadArticleData();
    ARTICLE_METHOD.loadPrefData();
});

