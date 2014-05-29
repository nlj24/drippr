window.address = document.URL;

window.fbAsyncInit = function() {
FB.init({
appId      : '231951950330964',
status     : true, // check login status
cookie     : true, // enable cookies to allow the server to access the session
xfbml      : true  // parse XFBML
});


FB.Event.subscribe("auth.logout", function() {
	window.location = 'http://localhost:5000';
});

$("#dripps").css("height",""+ ($( window ).height()-90));
// window.connect = false;
//check if we're logged in
   //display a modal or something?
   //remove it if they do login with the subscribe function below 


// Here we subscribe to the auth.authResponseChange JavaScript event. This event is fired
// for any authentication related change, such as login, logout or session refresh. This means that
// whenever someone who was previously logged out tries to log in again, the correct case below 
// will be handled. 
	window.FB.Event.subscribe('auth.authResponseChange', function(response) {
		$("#drippsPromo").attr("class", "hide");
		$("#size1").attr("class", "row");
		FB.api(
	    	"/me/friends",
	    	function (response2) {
	      		if (response2 && !response2.error) {
	      			var my_friends = response2.data;
					// Here we specify what we do with the response anytime this event occurs. 
					if (response.status === 'connected') {

						FB.api('/me', function(response) {
						$("#user").html("Welcome, " + response.first_name + "!");
				    	    $.ajax({
				                // url:'json/articles.json',
				                url: window.address + 'is_user',
				                data: {uid: response.id, fName: response.first_name, lName: response.last_name},
				                method:'get' //,
				                // success:this.userData
				            });

			    		});

						// The response object is returned with a status field that lets the app know the current
						// login status of the person. In this case, we're handling the situation where they 
						// have logged in to the app.
						window.chosenFriends = {}; //don't tell Ashwin about this!!
						window.ids = [];
						window.myID = response.authResponse.userID;

						//flatten out the friend list to just get their ids
						var friend_id_lst = [];
						for(var ii = 0; ii < my_friends.length; ii++) {
							friend_id_lst.push(my_friends[ii].id);
						}

						$.ajax({
			                // url:'json/articles.json',
			                url: window.address + 'shadow_users',
			                data: {lst: friend_id_lst},
			                method:'get',
			                success: everythingElse
			            });

						//I hope ashwin doesn't see this name...
			            function everythingElse(friend_data) {
			            	var friend_dict = {};
			                for(var jj=0; jj < friend_data.length; jj++) {
			                	friend_dict[friend_data[jj].id] = friend_data[jj];
			                }

							$('#fb-input').facebookAutocomplete({
								showAvatars: true,
								avatarSize: 50,
								maxSuggestions: 8,
								onpick: function (friend) {
									if(!friend_dict[friend.id]) { //need to make the SHADOW USER
										$.ajax({
							                // url:'json/articles.json',
							                url: window.address + 'add_shadow_user',
							                data: {id: friend.id},
							                method:'get'
							            });
							            friend_dict[friend.id] = {fName:"",id:friend.id,isReal:0,lName:""};
									}

									if(!friend_dict[friend.id].isReal) { // friend is a SHADOW USER
										FB.ui({
											to: friend.id,
											method: 'send',
											link: 'http://drippr.me',
										});
									} 

									var add_to_dom = false;
									if (!(friend.id in window.chosenFriends)) {
										window.ids.push(friend.id);
										add_to_dom = true;
									}
									window.chosenFriends[friend.id] = friend;

									if(add_to_dom) {
										if(!friend_dict[friend.id].isReal) { //SHADOW USER
											$("#chosen").append("<div class='red_friends' id='" + window.ids[(window.ids.length-1)] + "'> <img class = 'fbPics' src = http://graph.facebook.com/" + window.chosenFriends[window.ids[(window.ids.length-1)]]['id'] + "/picture?width=25&height=25>" + window.chosenFriends[window.ids[(window.ids.length-1)]]['name'] + " " + "<div id='"+window.ids[(window.ids.length-1)]+"' class='rm'>X</div></div>");
										} else {
											$("#chosen").append("<div class='blue_friends' id='" + window.ids[(window.ids.length-1)] + "'> <img class = 'fbPics' src = http://graph.facebook.com/" + window.chosenFriends[window.ids[(window.ids.length-1)]]['id'] + "/picture?width=25&height=25>" + window.chosenFriends[window.ids[(window.ids.length-1)]]['name'] + " " + "<div id='"+window.ids[(window.ids.length-1)]+"' class='rm'>X</div></div>");
										}
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

							$('#fb-input-groups').facebookAutocomplete({
				                showAvatars: true,
				                avatarSize: 50,
				                maxSuggestions: 8,
				                onpick: function (friend) {

				                	if(friend_dict[friend.id].isReal) {                		
					                    var add_to_dom = false;
					                    if (!(friend.id in window.chosenFriends)) {
					                        window.ids.push(friend.id);
					                        add_to_dom = true;
					                    }
					                    window.chosenFriends[friend.id] = friend;

					                    if(add_to_dom) {
					                        $("#chosenCont").append("<div class='blue_friends' id='" + window.ids[(window.ids.length-1)] + "'> <img class = 'fbPics' src = http://graph.facebook.com/" + window.chosenFriends[window.ids[(window.ids.length-1)]]['id'] + "/picture?width=25&height=25>" + window.chosenFriends[window.ids[(window.ids.length-1)]]['name'] + "<div id='"+window.ids[(window.ids.length-1)]+"' class='rm'>X</div></div>");
					                    }

					                    $(".rm" ).unbind("click", handler2);
					                    $(".rm").bind("click", handler2);

					                    var handler2 = $('.rm').click(function(e) {
					                        var id = $(e.target).attr('id');
					                        delete window.chosenFriends[id];
					                        window.ids.splice(window.ids.indexOf(id),1);
					                        $("#"+id).remove();
					                    });                        
				                	} else {
				                		FB.ui({
											to: friend.id,
											method: 'send',
											link: 'http://drippr.me',
										});
				                	}
				                }
				            });


							$(".send").click(function(){
								if (ids.length > 0) {
									$.ajax({
						                url: window.address + 'sendDripp',
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

							$("#groupBtn").click(function(){
								window.ids.push(window.myID);
				                if (window.ids.length) {
				                	var groupName = $('#groupName').val();

				                	for(var kk = 0; kk < window.groupList.length; kk++){
				                		if (groupName == window.groupList[kk]) {
				                			alert("you already have a group with that name LOL");
				                			return;
				                		}
				                	}

				                	if (!(window.ids.length > 1)) {
				                		alert("must add some members!!!!");
				                		return;
				                	}

				                    $.ajax({
				                        url: window.address + 'createGroup',
				                        data: {groupName: groupName, members: window.ids, creatorId: window.myID},
				                        type:'get'
				                	});
				                }
				                window.ids = [];
				            });

							
			            }
						window.GROUP_METHOD.loadGroups();
						window.ARTICLE_METHOD.loadArticleData();
						window.bindDripps();
						window.bindBucket();
			            
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
	      		}
	    	}
		);
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





