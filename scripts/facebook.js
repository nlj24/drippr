window.address = document.URL;

window.fbAsyncInit = function() {
FB.init({
appId      : '231951950330964',
status     : true, // check login status
cookie     : true, // enable cookies to allow the server to access the session
xfbml      : true  // parse XFBML
});


FB.Event.subscribe("auth.logout", function() {
	window.location = 'http://drippr.me';
});

$("#dripps").css("height",""+ ($(window).height()-91));
$(".arrow").css("margin-top",""+ (($(window).height()-90)/2) - 91);
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
							window.myName = response['name'];
							$("#user").html("<p id = 'centerWel'>Welcome, " + response.first_name + "!</p> <img class = 'fbPics2' src = http://graph.facebook.com/" + window.myID + "/picture?width=400&height=400>");
				    	    $.ajax({
				                // url:'json/articles.json',
				                url: window.address + 'is_user',
				                data: {uid: response.id, fName: response.first_name, lName: response.last_name, name: response.name},
				                method:'get' //,
				                // success:this.userData
				            });

			    		});

						// The window.response object is returned with a status field that lets the app know the current
						// login status of the person. In this case, we're handling the situation where they 
						// have logged in to the app.
						window.drippsChosenFriends = {}; //don't tell Ashwin about this!!
						window.groupsChosenFriends = {}; //don't tell Ashwin about this!!
						window.drippsIds = [];
						window.groupsIds = [];
						window.myID = response.authResponse.userID;

						//flatten out the friend list to just get their ids
						var friend_id_lst = [];
						for(var ii = 0; ii < my_friends.length; ii++) {
							friend_id_lst.push(my_friends[ii].id);
						}
						$.ajax({
			                // url:'json/articles.json',
			                url: window.address + 'shadow_users',
			                contentType: "json",
			                data: JSON.stringify({lst: friend_id_lst}),
			                method:'post',
			                success: everythingElse
			            });

						//I hope ashwin doesn't see this name...
			            function everythingElse(friend_data) {
			            	window.friend_dict = {};
			                for(var jj=0; jj < friend_data.length; jj++) {
			                	window.friend_dict[friend_data[jj].id] = friend_data[jj];
			                }

							$('#fb-input').facebookAutocomplete({
								showAvatars: true,
								avatarSize: 50,
								maxSuggestions: 8,
								onpick: function (friend) {
									if(!window.friend_dict[friend.id]) { //need to make the SHADOW USER
										$.ajax({
							                // url:'json/articles.json',
							                url: window.address + 'add_shadow_user',
							                data: {id: friend.id, name: friend.name},
							                method:'get'
							            });
							            window.friend_dict[friend.id] = {fName:"",id:friend.id,isReal:0,lName:""};
									}

									if(!window.friend_dict[friend.id].isReal) { // friend is a SHADOW USER
										FB.ui({
											to: friend.id,
											method: 'send',
											link: 'http://drippr.me',
										});
									} 

									var add_to_dom = false;
									if (!(friend.id in window.drippsChosenFriends)) {
										window.drippsIds.push(friend.id);
										add_to_dom = true;
									}
									window.drippsChosenFriends[friend.id] = friend;

									if(add_to_dom) {
										if(!window.friend_dict[friend.id].isReal) { //SHADOW USER
											$("#chosen").append("<div class='red_friends' id='" + window.drippsIds[(window.drippsIds.length-1)] + "'> <img class = 'fbPics' src = http://graph.facebook.com/" + window.drippsChosenFriends[window.drippsIds[(window.drippsIds.length-1)]]['id'] + "/picture?width=25&height=25>" + window.drippsChosenFriends[window.drippsIds[(window.drippsIds.length-1)]]['name'] + " " + "<div id='"+window.drippsIds[(window.drippsIds.length-1)]+"' class='rm'>X</div></div>");
										} else {
											$("#chosen").append("<div class='blue_friends' id='" + window.drippsIds[(window.drippsIds.length-1)] + "'> <img class = 'fbPics' src = http://graph.facebook.com/" + window.drippsChosenFriends[window.drippsIds[(window.drippsIds.length-1)]]['id'] + "/picture?width=25&height=25>" + window.drippsChosenFriends[window.drippsIds[(window.drippsIds.length-1)]]['name'] + " " + "<div id='"+window.drippsIds[(window.drippsIds.length-1)]+"' class='rm'>X</div></div>");
										}
									}

									$(".rm" ).unbind("click", handler2);
				    				$(".rm").bind("click", handler2);

				                    var handler2 = $('.rm').click(function(e) {
				                        var id = $(e.target).attr('id');
				                        delete window.drippsChosenFriends[id];
				                        window.drippsIds.splice(window.drippsIds.indexOf(id),1);
										$("#"+id).remove();
				                    });                        
								}
								
							});

							$('#fb-input-groups').facebookAutocomplete({
				                showAvatars: true,
								avatarSize: 50,
								maxSuggestions: 8,
								onpick: function (friend) {
									if(!window.friend_dict[friend.id]) { //need to make the SHADOW USER
										$.ajax({
							                // url:'json/articles.json',
							                url: window.address + 'add_shadow_user',
							                data: {id: friend.id, name: friend.name},
							                method:'get'
							            });
							            window.friend_dict[friend.id] = {fName:"",id:friend.id,isReal:0,lName:""};
									}

									if(!window.friend_dict[friend.id].isReal) { // friend is a SHADOW USER
										FB.ui({
											to: friend.id,
											method: 'send',
											link: 'http://drippr.me',
										});
									} 

									var add_to_dom = false;
									if (!(friend.id in window.groupsChosenFriends)) {
										window.groupsIds.push(friend.id);
										add_to_dom = true;
									}
									window.groupsChosenFriends[friend.id] = friend;

									if(add_to_dom) {
										if(!window.friend_dict[friend.id].isReal) { //SHADOW USER
											$("#chosenCont").append("<div class='red_friends' id='" + window.groupsIds[(window.groupsIds.length-1)] + "'>" + window.groupsChosenFriends[window.groupsIds[(window.groupsIds.length-1)]]['name'] + " " + "<div id='"+window.groupsIds[(window.groupsIds.length-1)]+"' class='rm'>X</div></div>");
										} else {
											$("#chosenCont").append("<div class='blue_friends' id='" + window.groupsIds[(window.groupsIds.length-1)] + "'>"+ window.groupsChosenFriends[window.groupsIds[(window.groupsIds.length-1)]]['name'] + " " + "<div id='"+window.groupsIds[(window.groupsIds.length-1)]+"' class='rm'>X</div></div>");
										}
									}
									$(".rm" ).unbind("click", handler2);
				    				$(".rm").bind("click", handler2);
				                    var handler2 = $('.rm').click(function(e) {
				                        var id = $(e.target).attr('id');
				                        delete window.groupsChosenFriends[id];
				                        window.groupsIds.splice(window.groupsIds.indexOf(id),1);
										$("#"+id).remove();
				                    });
								}
								
							});

							$(".send").click(function(){
								if (window.drippsIds.length > 0) {
									$.ajax({
						                url: window.address + 'sendDripp',
						                data: {fromUserId: window.myID, recipientGroup: -1, recipientFriendIds: window.drippsIds, articleId: window.curArticle},
						                type:'get'
						            });
								}
								if (window.drippsIds.length > 0) {
									$(".showForm").attr("class", "showForm hide");
									$(".success").attr("class", "success");
								}
					            window.drippsChosenFriends = {};
								window.drippsIds=[];
								$('#chosen').empty();
							});

							$("#groupBtn").click(function(){
				                if ((window.groupsIds.length) && (($('#groupName').val()!= ""))) {
				                	var groupName = $('#groupName').val();

				                	for(var kk = 0; kk < window.groupList.length; kk++){
				                		if (groupName == window.groupList[kk]) {
				                			alert("you already have a group with that name LOL");
				                			return;
				                		}
				                	}

				                	for (var i = 0; i < groupName.length; i++) {
				                		if(groupName[i] == "\"") {
											var groupName = groupName.substring(0, i) + "'" + groupName.substring(i+1);
				                		}
				                	}

									window.groupsIds.push(window.myID);
				                    $.ajax({
				                        url: window.address + 'createGroup',
				                        data: {groupName: groupName, members: window.groupsIds, creatorId: window.myID},
				                        type:'get'
				                	});

				                    membersString = "";
				                	for(var person in window.groupsChosenFriends) {
				                		if(!window.friend_dict[window.groupsChosenFriends[person]['id']].isReal) { //SHADOW USER
											membersString += "<div class='red_friends'>" + window.groupsChosenFriends[person]['name'] + "</div>";
										} else {
											membersString += "<div class='blue_friends'>" + window.groupsChosenFriends[person]['name'] + "</div>";
										}
				                	}
				                	membersString += "<div class='blue_friends'>" + window.myName + "</div>";

				                	//how to come up with id
				                    $("#my_groupContainer").append("<div class ='row' id = " + 'group_{{this.id}}' + "><div class = 'col-xs-1'></div><div class ='row col-xs-10 groupRowStyle'><div class = 'col-xs-2'>" + groupName +"</div><div class ='col-xs-8'>" + membersString + "</div><div class = 'col-xs-2 deleteGroup'>delete group</div></div><div class = 'col-xs-1'></div></div>");

				           //          var handler3 = $(".deleteGroup").click(function(e){
				           //          	console.log('2');
							        //     var groupId = $(e.target).attr('group_id');
							        //     if (groupId == null) {
							        //         alert("cunt");
							        //     }
							        //     else {
							        //         $("#group_" + groupId).attr("class", "hide");
							        //         $.ajax({
							        //             url: window.address + 'deleteGroup',
							        //             data: {groupId: groupId},
							        //             method:'get',
							        //             success: function(data){return;}
							        //         });
							        //     }
							        // });
							        // $(".deleteGroup").unbind("click", handler3);

				                    $('#chosenCont').html('');
									$('#groupName').val('');
				                	window.groupsIds = [];
				                	window.groupsChosenFriends = {};
				                }
			                	else {
			                		alert("must add some members and have group name!!!");
			                		return;
			                	}
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





