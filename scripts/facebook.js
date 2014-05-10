window.fbAsyncInit = function() {
FB.init({
appId      : '231951950330964',
status     : true, // check login status
cookie     : true, // enable cookies to allow the server to access the session
xfbml      : true  // parse XFBML
});

// Here we subscribe to the auth.authResponseChange JavaScript event. This event is fired
// for any authentication related change, such as login, logout or session refresh. This means that
// whenever someone who was previously logged out tries to log in again, the correct case below 
// will be handled. 
	FB.Event.subscribe('auth.authResponseChange', function(response) {
		// Here we specify what we do with the response anytime this event occurs. 
		if (response.status === 'connected') {
			// The response object is returned with a status field that lets the app know the current
			// login status of the person. In this case, we're handling the situation where they 
			// have logged in to the app.
			getFriends();
			var chosenFriends = {};
			var ids = [];
			var myID = response.authResponse.userID;
			$('#fb-input').facebookAutocomplete({
				showAvatars: true,
				avatarSize: 50,
				maxSuggestions: 8,
				onpick: function (friend) {
					console.log("You picked: " + friend.name + " with an ID of " + friend.id);
					if (!(friend.id in chosenFriends)) {
						ids.push(friend.id);
					}
					chosenFriends[friend.id] = friend;
					console.log(chosenFriends);
					var chosenHTML = chosenFriends[ids[0]]['name'];
					for (var i = 1; i < ids.length; i++) {
						chosenHTML += ", " + chosenFriends[ids[i]]['name'];
					}
					$('#chosen').html(chosenHTML);
					$(".send").click(function(){

						$.ajax({
			                url:'http://localhost:5000/sendDripp',
			                data: {fromUserId: myID, recipientGroup: -1, recipientFriendIds: ids, articleId: window.curArticle},
			                type:'get'
			            });
					});
				}

			});
            
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
		$('#logout').click(function(){
			FB.logout(function(response) {
			  // user is now logged out
			  window.location.assign("http://localhost:5000");
			});
		});
		FB.api('/me', function(response) {
        	console.log("Welcome " + response.name + ": Your UID is " + response.id); 
        	console.log(response);

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
(function(d){
var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
	if (d.getElementById(id)) {
		return;
	}
js = d.createElement('script');
js.id = id; js.async = true;
js.src = "//connect.facebook.net/en_US/all.js";
ref.parentNode.insertBefore(js, ref);
}(document));

// Here we run a very simple test of the Graph API after login is successful. 
// This testAPI() function is only called in those cases. 

// Gets Facebook friends as an array of Objects 
function getFriends() {
	FB.api( "/me/friends",
		function (response) {
			console.log(response);
			for (var i=0;i<response.data.length;i++) {
				if (response.data[i]['name'] == 'Darshan Patel') {
					console.log("Darshan is " + response.data[i]['id']);
				}
			}
				if (response && !response.error) {
			/* handle the result */
				}
		}
	);
}