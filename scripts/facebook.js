window.address = "http://drippr.me/";

window.fbAsyncInit = function() {
FB.init({
appId      : '231951950330964',
status     : true, // check login status
cookie     : true, // enable cookies to allow the server to access the session
xfbml      : true  // parse XFBML
});


FB.Event.subscribe("auth.logout", function() {
	window.location = window.address;
});


$(document).ready(function(){
	window.drippsChosenFriends = {};
	window.groupsChosenFriends = {};
	window.addChosenFriends = {};
	window.drippsIds = [];
	window.groupsIds = [];
	window.addIds = [];
	window.selGroups = [];
	window.articlesReceived = {};
	window.curArticlePosition = [];
	window.curArticlePosition["All"] = {};
	window.curArticlePosition["USA"] = {};
	window.curArticlePosition["World"] = {};
	window.curArticlePosition["Politics"] = {};
	window.curArticlePosition["Business"] = {};
	window.curArticlePosition["Sports"] = {};
	window.curArticlePosition["Entertainment"] = {};
	window.curArticlePosition["Tech"] = {};
	window.curArticlePosition["Weird"] = {};
	window.curArticlePosition["Science"] = {};
	window.curArticlePosition["Health"] = {};
	window.curArticlePosition["Lifestyle"] = {};
	window.curArticlePosition2 = {};
	window.curArticlePosition3 = {};
	window.curArticlePosition3["All"] = 0;
	window.curArticlePosition3["USA"] = 0;
	window.curArticlePosition3["World"] = 0;
	window.curArticlePosition3["Politics"] = 0;
	window.curArticlePosition3["Business"] = 0;
	window.curArticlePosition3["Sports"] = 0;
	window.curArticlePosition3["Entertainment"] = 0;
	window.curArticlePosition3["Tech"] = 0;
	window.curArticlePosition3["Weird"] = 0;
	window.curArticlePosition3["Science"] = 0;
	window.curArticlePosition3["Health"] = 0;
	window.curArticlePosition3["Lifestyle"] = 0;
});

$("#dripps").css("height",""+ ($(window).height()-91));
$(".arrow").css("margin-top",""+ (($(window).height()-90)/2) - 91);
$("#arrowIntro").css("height",""+ ($(window).height()-91));
$("#arrowIntro").css("line-height",""+ ($(window).height()-91));

$("#drippsPromo").css("height",""+ ($(window).height()-104));
$("#drippsPromo").css("line-height",""+ ($(window).height()-134 + "px"));
$("#drippsIntro").css("width",""+ ($(window).height()-134)*720/540);
$(".fitIntroImg").attr("class", "fitIntroImg");
$(".listWidth").css("width",$(".fitIntroImg").width());
$(".arrowIntro").attr("class", "arrowIntro");

$(document).keydown(function(e){

    if (!$("#drippsPromo").hasClass("hide")) {
        if (e.keyCode == 37) {
            javascript:sliders2[0].goToPrev();
        }
        if (e.keyCode == 39) {
            javascript:sliders2[0].goToNext();
        }
    }
});

//check if we're logged in
   //display a modal or something?
   //remove it if they do login with the subscribe function below 


// Here we subscribe to the auth.authResponseChange JavaScript event. This event is fired
// for any authentication related change, such as login, logout or session refresh. This means that
// whenever someone who was previously logged out tries to log in again, the correct case below 
// will be handled.
	window.FB.Event.subscribe('auth.authResponseChange', function(response) {
		$("#drippsPromo").attr("class", "hide");
		$("#drippsPromoHeader").attr("class", "hide");
		$("#dripps").attr("class", "container-fluid");
		$("#drippsHeader").attr("class", "col-xs-5 headingPad");
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
				                data: {uid: response.id, fName: response.first_name, lName: response.last_name, name: response.name, email: response.email},
				                method:'get' //,
				                // success:this.userData
				            });

			    		});

						// The window.response object is returned with a status field that lets the app know the current
						// login status of the person. In this case, we're handling the situation where they 
						// have logged in to the app.
						window.drippsChosenFriends = {};
						window.groupsChosenFriends = {};
						window.addChosenFriends = {};
						window.drippsIds = [];
						window.groupsIds = [];
						window.addIds = [];
						window.myID = response.authResponse.userID;
						window.selGroups = [];

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

							$('.fb-input').facebookAutocomplete({
								showAvatars: true,
								avatarSize: 50,
								maxSuggestions: 8,
								onpick: function (friend) {
									try {
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
												link: 'http://drippr.me/',
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
												$("#chosen").append("<div class='red_friends' id='" + window.drippsIds[(window.drippsIds.length-1)] + "'>" + window.drippsChosenFriends[window.drippsIds[(window.drippsIds.length-1)]]['name'] + " " + "<div id='"+window.drippsIds[(window.drippsIds.length-1)]+"' class='rm'>X</div></div>");
											} else {
												$("#chosen").append("<div class='blue_friends' id='" + window.drippsIds[(window.drippsIds.length-1)] + "'>" + window.drippsChosenFriends[window.drippsIds[(window.drippsIds.length-1)]]['name'] + " " + "<div id='"+window.drippsIds[(window.drippsIds.length-1)]+"' class='rm'>X</div></div>");
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
									catch(e) {
					                	return;
					                }
								}	
							});

							$('#fb-input-groups').facebookAutocomplete({
				                showAvatars: true,
								avatarSize: 50,
								maxSuggestions: 8,
								onpick: function (friend) {
									try {
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
					                catch(e) {
					                	return;
					                }
								}						
							});

							$('.fb-input-add').facebookAutocomplete({
								showAvatars: true,
								avatarSize: 50,
								maxSuggestions: 8,
								onpick: function (friend) {
									try {
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
										if (!(friend.id in window.addChosenFriends)) {
											window.addIds.push(friend.id);
											add_to_dom = true;
										}
										window.addChosenFriends[friend.id] = friend;

										if(add_to_dom) {
											if(!window.friend_dict[friend.id].isReal) { //SHADOW USER
												$("#addChosenCont").append("<div class='red_friends' id='person_" + window.addIds[(window.addIds.length-1)] + "'>" + window.addChosenFriends[window.addIds[(window.addIds.length-1)]]['name'] + " " + "<div id='"+window.addIds[(window.addIds.length-1)]+"' class='rm'>X</div></div>");
											} else {
												$("#addChosenCont").append("<div class='blue_friends' id='person_" + window.addIds[(window.addIds.length-1)] + "'>" + window.addChosenFriends[window.addIds[(window.addIds.length-1)]]['name'] + " " + "<div id='"+window.addIds[(window.addIds.length-1)]+"' class='rm'>X</div></div>");
											}
										}

										$(".rm" ).unbind("click", handler2);

					                    var handler2 = $('.rm').click(function(e) {
					                        var id = $(e.target).attr('id');
					                        delete window.addChosenFriends[id];
					                        window.addIds.splice(window.addIds.indexOf(id),1);
											$("#person_"+id).remove();
					                    });
									}
									catch(e) {
					                	return;
					                }
								}	
							});

							$('.fb-input-add-new').facebookAutocomplete({
								showAvatars: true,
								avatarSize: 50,
								maxSuggestions: 8,
								onpick: function (friend) {
									try {
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
										if (!(friend.id in window.addChosenFriends)) {
											window.addIds.push(friend.id);
											add_to_dom = true;
										}
										window.addChosenFriends[friend.id] = friend;

										if(add_to_dom) {
											if(!window.friend_dict[friend.id].isReal) { //SHADOW USER
												$("#addChosenContNew").append("<div class='red_friends' id='person_" + window.addIds[(window.addIds.length-1)] + "'>" + window.addChosenFriends[window.addIds[(window.addIds.length-1)]]['name'] + " " + "<div id='"+window.addIds[(window.addIds.length-1)]+"' class='rm'>X</div></div>");
											} else {
												$("#addChosenContNew").append("<div class='blue_friends' id='person_" + window.addIds[(window.addIds.length-1)] + "'>" + window.addChosenFriends[window.addIds[(window.addIds.length-1)]]['name'] + " " + "<div id='"+window.addIds[(window.addIds.length-1)]+"' class='rm'>X</div></div>");
											}
										}

										$(".rm" ).unbind("click", handler2);

					                    var handler2 = $('.rm').click(function(e) {
					                        var id = $(e.target).attr('id');
					                        delete window.addChosenFriends[id];
					                        window.addIds.splice(window.addIds.indexOf(id),1);
											$("#person_"+id).remove();
					                    });
									}
									catch(e) {
					                	return;
					                }
								}	
							});


							$(".send").click(function(){

								if (window.drippsIds.length > 0 || window.selGroups.length > 0) {
									var selGroupsDict = {}
									if(window.selGroups.length > 0) {
										for(var ii = 0; ii < selGroups.length; ii++) {
											var friendLst = window.all_members_dict[selGroups[ii]].list;
											selGroupsDict[selGroups[ii]] = [];
											for(var jj = 0; jj < friendLst.length; jj++) {
												selGroupsDict[selGroups[ii]].push(friendLst[jj].userId);
											}
											selGroupsDict[selGroups[ii]].splice(selGroupsDict[selGroups[ii]].indexOf(window.myID),1);
										}
									}
									var content = $('#messageInput2').val();
							        for (var i = 0; i < content.length; i++) {
							            if(content[i] == "\"") {
							                content = content.substring(0, i) + "'" + content.substring(i+1);
							            }
							        }
							        $('#messageInput2').val('');
									$.ajax({
						                url: window.address + 'sendDripp',
						                data: {groupsDict: JSON.stringify(selGroupsDict), fromUserId: window.myID, recipientGroup: window.selGroups, recipientFriendIds: window.drippsIds, articleId: window.articleSendId, content: content},
						                type:'get'
						            });
									$(".showForm").attr("class", "showForm hide");
									$(".success").attr("class", "success");
						            window.drippsChosenFriends = {};
									window.drippsIds=[];
									window.selGroups = [];
									$('#chosen').empty();
									setTimeout(function() {
					                    $('#myModal').modal('hide');
					                }, 3500);
								}							
							});


							// creating a group...
							$("#groupBtn").click(function(){

				                if (window.groupsIds.length > 1) {
				                	if ($('#groupName').val()!= "") {
					                	var groupName = $('#groupName').val();

					                	for(var kk = 0; kk < window.groupList.length; kk++){
					                		if (groupName == window.groupList[kk]) {
					                			$('#myModal4').modal('show');
					                			setTimeout(function() {
							                    	$('#myModal4').modal('hide');
							                	}, 3000);
					                			return;
					                		}
					                	}

					                	if ($.isEmptyObject(window.my_members_dict)) {
				                            $('#my_group_container').html("");
				                        }

				                        window.my_members_dict[groupName] = {name: groupName};

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
					                    window.my_members_dict[window.currentId] = {};
					                	window.my_members_dict[window.currentId]['list'] = [{userId: window.myID}];

					                	for(var person in window.groupsChosenFriends) {
					                		window.my_members_dict[window.currentId]['list'].push({userId: window.groupsChosenFriends[person]['id']});

					                		if(!window.friend_dict[window.groupsChosenFriends[person]['id']].isReal) { //SHADOW USER
												membersString += "<div class='red_friends'>" + window.groupsChosenFriends[person]['name'] + "</div>";
											} else {
												membersString += "<div class='blue_friends'>" + window.groupsChosenFriends[person]['name'] + "</div>";
											}
					                	}
					                	membersString += "<div class='blue_friends'>" + window.myName + "</div>";




					                    $("#my_group_container").append("<div group_id=" + window.currentId +"  group_name = 'group_" + groupName + "' class = 'row groupRowStyle'><div class = 'col-xs-2 nameGroupsStyle'>" + groupName + "</div><div class = 'col-xs-8 namesList'><div class='personName'>" + membersString + "</div></div><div class = 'col-xs-2'><div group_id=" + window.currentId + " class = 'addMemsNew' data-toggle='modal' data-target='#myModal3'>add members</div><div class = 'deleteGroup2'>delete</div></div></div>");
					                    window.currentId++;



					                    $(".deleteGroup2").unbind("click", handler3);
					                    
					                    var handler3 = $(".deleteGroup2").click(function(e){
								            var groupRow = ($(e.target).parents(".groupRowStyle"));
								            groupName = groupRow.find(".nameGroupsStyle").text();
								            delete window.my_members_dict[groupName];					                
								            var groupRowHeight = $(groupRow).height();
							                $(groupRow).html("<div class = 'groupDeletionStyle'> your group was deleted.</div>");
							                $(groupRow).height(groupRowHeight);
							                setTimeout(function() {
							                    $(groupRow).fadeOut(400, function() {
							                        $(groupRow).remove();
							                        $(".groupRowStyle:nth-of-type(odd)").css("background-color", "azure");
							                        $(".groupRowStyle:nth-of-type(even)").css("background-color", "#e9eaed");
							                        if ($.isEmptyObject(window.my_members_dict)) {
								                        $('#my_group_container').html("you haven't created any groups");
								                    }
							                    });
							                }, 3500);
							                $.ajax({
							                    url: window.address + 'deleteNewGroup',
							                    data: {creatorId: window.myID, groupName: groupName},
							                    method:'get',
							                    success: function(data){return;}
							                });
								        });
										
										$(".addMemsNew").unbind("click", handler4);
										var handler4 = $(".addMemsNew").click(function(e){
								            $("#addChosenContNew").html('');
								            window.addIds = [];
								            window.addChosenFriends = {};
								            $(".showForm").attr("class", "showForm");
								            $(".success").attr("class", "success hide");
								            var groupRow = ($(e.target).parents(".groupRowStyle"));
								            window.groupName = groupRow.find(".nameGroupsStyle").text();
								            window.groupId = $(e.target).attr('group_id');

								            window.currentGroupMembers = [];
								            for (var ii = 0; ii < window.my_members_dict[window.groupId]['list'].length; ii++) {
								                window.currentGroupMembers.push(window.my_members_dict[window.groupId]['list'][ii].userId);
								            }
								            $(".groupModalName").html("add members to " + window.groupName);
								        });
										
										$('#chosenCont').html('<div class = "createdSuccessStyle">your group has been created!</div>');
										setTimeout(function() {
						                    $('.createdSuccessStyle').fadeOut(400, function() {
						                        $('#chosenCont').html('');
						                    });
						                }, 3500);
					                   
										$('#groupName').val('');
					                	window.groupsIds = [];
					                	window.groupsChosenFriends = {};
					                }
					                else {
					                	$('#myModal5').modal('show');
			                			setTimeout(function() {
					                    	$('#myModal5').modal('hide');
					                	}, 3000);
					                	return;
					                }
				                }
			                	else {
			                		$('#myModal6').modal('show');
		                			setTimeout(function() {
				                    	$('#myModal6').modal('hide');
				                	}, 3000);
			                		return;
			                	}
								window.drippsChosenFriends = {};
								window.groupsChosenFriends = {};
								window.addChosenFriends = {};
								window.drippsIds = [];
								window.groupsIds = [];
								window.addIds = [];

								window.selGroups = [];

				            });

							$(".add").click(function(){
				                if (window.addIds.length > 0) {
				                    $.ajax({
				                        url: window.address + 'addMembers',
				                        data: {groupName: window.groupName, groupId: window.groupId, members: window.addIds, creatorId: window.myID},
				                        type:'get'
				                	});

				                    membersString = "";
				                	for(var person in window.addChosenFriends) {
				                		window.my_members_dict[window.groupId]['list'].push({userId: window.addChosenFriends[person]['id'] });
				                		if(!window.friend_dict[window.addChosenFriends[person]['id']].isReal) { //SHADOW USER
											membersString += "<div class='red_friends'>" + window.addChosenFriends[person]['name'] + "</div>";
										} else {
											membersString += "<div class='blue_friends'>" + window.addChosenFriends[person]['name'] + "</div>";
										}
				                	}

				                	window.addIds = [];
				                	window.addChosenFriends = {};
				                    $("[group_id=" + "group_" + window.groupId + "]").find(".namesList").append(membersString);
				                    
									$(".showForm").attr("class", "showForm hide");
									$(".success").attr("class", "success");
									$("#addChosenCont").html('');
				                   
				                	setTimeout(function() {
					                    $('#myModal2').modal('hide');
					                }, 3500);
				                }
				            });

							$(".addNew").click(function(){
				                if (window.addIds.length > 0) {
				                    $.ajax({
				                        url: window.address + 'addMembersNew',
				                        data: {groupName: window.groupName, members: window.addIds, creatorId: window.myID},
				                        type:'get'
				                	});

				                    membersString = "";
				                	for(var person in window.addChosenFriends) {
				                		window.my_members_dict[window.groupId]['list'].push({userId: window.addChosenFriends[person]['id'] });

				                		if(!window.friend_dict[window.addChosenFriends[person]['id']].isReal) { //SHADOW USER
											membersString += "<div class='red_friends'>" + window.addChosenFriends[person]['name'] + "</div>";
										} else {
											membersString += "<div class='blue_friends'>" + window.addChosenFriends[person]['name'] + "</div>";
										}
				                	}

				                    $("[group_name=" + "group_" + window.groupName + "]").find(".namesList").append(membersString);
				                    
									$(".showForm").attr("class", "showForm hide");
									$(".success").attr("class", "success");
									$("#addChosenContNew").html('');
				                   
				                	window.addIds = [];
				                	window.addChosenFriends = {};
				                	setTimeout(function() {
					                    $('#myModal3').modal('hide');
					                }, 3500);
				                }
				            });
			            }

						window.GROUP_METHOD.loadGroups();

						window.onhashchange = function (e){


						    if (location.hash == "#dripp") {
						        window.ARTICLE_METHOD.loadArticleData();
						        window.setDrippLikes();
						        $("#buckets").attr("class", "container-fluid hide");
						        $("#bucketsHeader").attr("class", "col-md-5 headingPad hide");
						        $("#dripps").attr("class", "container-fluid");
						        $("#drippsHeader").attr("class", "col-md-5 headingPad");
						        $("#groups").attr("class", "container-fluid hide");
						        $("#groupsHeader").attr("class", "col-md-5 headingPad hide");
						        window.BUCKET_METHOD.loadArticleData();
						    }

						    if (location.hash == "#bucket") {
						        window.BUCKET_METHOD.loadArticleData();
						        $("#dripps").attr("class", "container-fluid hide");
						        $("#drippsHeader").attr("class", "col-md-5 headingPad hide");
						        $("#buckets").attr("class", "container-fluid");
						        $("#bucketsHeader").attr("class", "col-md-5 headingPad");
						        $("#groups").attr("class", "container-fluid hide");
						        $("#groupsHeader").attr("class", "col-md-5 headingPad hide");
						        window.resetFB();
						        $(".selBucket").attr("class", "selBucket");
                				$("[bucketidentifier=dripps]").attr("class", "selBucket selectedBucket");
						    }
						    if (location.hash == "#group") {

						        window.GROUP_METHOD.loadGroups();
						        $("#buckets").attr("class", "container-fluid hide");
						        $("#bucketsHeader").attr("class", "col-md-5 headingPad hide");
						        $("#dripps").attr("class", "container-fluid hide");
						        $("#drippsHeader").attr("class", "col-md-5 headingPad hide");
						        $("#groups").attr("class", "container-fluid");
						        $("#groupsHeader").attr("class", "col-md-5 headingPad");
						        window.BUCKET_METHOD.loadArticleData();
						    }

						}
						
						window.bindDripps();
						window.bindBucket();

						switch(location.hash){
							case "#bucket":
								$("#dripps").attr("class", "container-fluid hide");
						        $("#drippsHeader").attr("class", "col-md-5 headingPad hide");
						        $("#buckets").attr("class", "container-fluid");
						        $("#bucketsHeader").attr("class", "col-md-5 headingPad");
						        $("#groups").attr("class", "container-fluid hide");
						        $("#groupsHeader").attr("class", "col-md-5 headingPad hide");
								break;
							case "#group":
								$("#buckets").attr("class", "container-fluid hide");
						        $("#bucketsHeader").attr("class", "col-md-5 headingPad hide");
						        $("#dripps").attr("class", "container-fluid hide");
						        $("#drippsHeader").attr("class", "col-md-5 headingPad hide");
						        $("#groups").attr("class", "container-fluid");
						        $("#groupsHeader").attr("class", "col-md-5 headingPad");
						        window.BUCKET_METHOD.loadArticleData();
								break;
								
						}





			            
					} else if (response.status === 'not_authorized') {
						// In this case, the person is logged into Facebook, but not into the app, so we call
						// FB.login() to prompt them to do so. 
						// In real-life usage, you wouldn't want to immediately prompt someone to login 
						// like this, for two reasons:
						// (1) JavaScript created popup windows are blocked by most browsers unless they 
						// result from direct interaction from people using the app (such as a mouse click)
						// (2) it is a bad experience to be continually prompted to login upon page load.
						FB.login(function(response) {
 						}, {scope: 'email'}); 
					} else {
						// In this case, the person is not logged into Facebook, so we call the login() 
						// function to prompt them to do so. Note that at this stage there is no indication
						// of whether they are logged into the app. If they aren't then they'll see the Login
						// dialog right after they log in to Facebook. 
						// The same caveats as above apply to the FB.login() call here.
						FB.login(function(response) {
 						}, {scope: 'email'});
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





