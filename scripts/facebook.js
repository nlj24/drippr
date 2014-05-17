window.fbAsyncInit = function() {
FB.init({
appId      : '231951950330964',
status     : true, // check login status
cookie     : true, // enable cookies to allow the server to access the session
xfbml      : true  // parse XFBML
});
FB.Event.subscribe("auth.logout", function() {
	window.fbAsyncInit();
	window.ARTICLE_METHOD.loadArticleData();
	window.BUCKET_METHOD.loadArticleData();
	window.location = 'http://localhost:5000';
});
// Here we subscribe to the auth.authResponseChange JavaScript event. This event is fired
// for any authentication related change, such as login, logout or session refresh. This means that
// whenever someone who was previously logged out tries to log in again, the correct case below 
// will be handled. 
	window.FB.Event.subscribe('auth.authResponseChange', function(response) {
		// Here we specify what we do with the response anytime this event occurs. 
		if (response.status === 'connected') {
			// The response object is returned with a status field that lets the app know the current
			// login status of the person. In this case, we're handling the situation where they 
			// have logged in to the app.
			window.chosenFriends = {}; //don't tell Ashwin about this!!
			window.ids = [];
			window.myID = response.authResponse.userID;
			$('#fb-input').facebookAutocomplete({
				showAvatars: true,
				avatarSize: 50,
				maxSuggestions: 8,
				onpick: function (friend) {
					var add_to_dom = false;
					if (!(friend.id in window.chosenFriends)) {
						window.ids.push(friend.id);
						add_to_dom = true;
					}
					window.chosenFriends[friend.id] = friend;

					if(add_to_dom) {
						$("#chosen").append("<div class='friends' id='" + window.ids[(window.ids.length-1)] + "'> <img class = 'fbPics' src = http://graph.facebook.com/" + window.chosenFriends[window.ids[(window.ids.length-1)]]['id'] + "/picture?width=25&height=25>" + window.chosenFriends[window.ids[(window.ids.length-1)]]['name'] + "<div id='"+window.ids[(window.ids.length-1)]+"' class='rm'>X</div></div>");
					}

					$(".rm" ).unbind("click", handler2);
    				$(".rm").bind("click", handler2);

                    var handler2 = $('.rm').click(function(e) {
                        var id = $(e.target).attr('id');
                        delete window.chosenFriends[id];
                        window.ids.splice(window.ids.indexOf(id),1);
						$("#"+id).remove();
                    });                        
				}
			});

			$(".send").click(function(){
				if (ids.length > 0) {
					$.ajax({
		                url:'http://localhost:5000/sendDripp',
		                data: {fromUserId: window.myID, recipientGroup: -1, recipientFriendIds: window.ids, articleId: window.curArticle},
		                type:'get'
		            });
				}
				if (ids.length > 0) {
					$(".showForm").attr("class", "showForm hide");
					$(".success").attr("class", "success");
				}
	            window.chosenFriends = {};
				window.ids=[];
				$('#chosen').empty();
			});

			$(".group").click(function(){
				console.log(window.ids);
				window.ids.push(window.myID);
                if (window.ids.length) {
                    $.ajax({
                        url:'http://localhost:5000/createGroup',
                        data: {groupName: $('#groupName').val(), members: window.ids, creatorId: window.myID},
                        type:'get'
                	});
                }
                window.ids = [];
            });

			$(".close").click(function(){
				$.modal.close();
			});

			window.ARTICLE_METHOD.loadArticleData();
			window.BUCKET_METHOD.loadArticleData();

            
		} else if (response.status === 'not_authorized') {
			// In this case, the person is logged into Facebook, but not into the app, so we call
			// FB.login() to prompt them to do so. 
			// In real-life usage, you wouldn't want to immediately prompt someone to login 
			// like this, for two reasons:
			// (1) JavaScript created popup windows are blocked by most browsers unless they 
			// result from direct interaction from people using the app (such as a mouse click)
			// (2) it is a bad experience to be continually prompted to login upon page load.
			FB.login();
		} else {
			// In this case, the person is not logged into Facebook, so we call the login() 
			// function to prompt them to do so. Note that at this stage there is no indication
			// of whether they are logged into the app. If they aren't then they'll see the Login
			// dialog right after they log in to Facebook. 
			// The same caveats as above apply to the FB.login() call here.
			FB.login();
		}
		FB.api('/me', function(response) {
			$("#user").html(response.first_name);
    	    $.ajax({
                // url:'json/articles.json',
                url:'http://localhost:5000/is_user',
                data: {uid: response.id, fName: response.first_name, lName: response.last_name},
                method:'get',
                success:this.userData
            });

    	});


	});
 

};

// Load the SDK asynchronously
(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/en_US/all.js";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));