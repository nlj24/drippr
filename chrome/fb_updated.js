window.address = "http://drippr.me/";

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

var windowHeight = $(window).height()-91;
$("#extContScroll").css("height",windowHeight);


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

                            $('#fb-input-ext').facebookAutocomplete({
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
                                        if (!(friend.id in window.drippsChosenFriends)) {
                                            window.drippsIds.push(friend.id);
                                            add_to_dom = true;
                                        }
                                        window.drippsChosenFriends[friend.id] = friend;

                                        if(add_to_dom) {
                                            if(!window.friend_dict[friend.id].isReal) { //SHADOW USER
                                                $("#chosen_ext").append("<div class='red_friends' id='" + window.drippsIds[(window.drippsIds.length-1)] + "'>" + window.drippsChosenFriends[window.drippsIds[(window.drippsIds.length-1)]]['name'] + " " + "<div id='"+window.drippsIds[(window.drippsIds.length-1)]+"' class='rm'>X</div></div>");
                                            } else {
                                                $("#chosen_ext").append("<div class='blue_friends' id='" + window.drippsIds[(window.drippsIds.length-1)] + "'>" + window.drippsChosenFriends[window.drippsIds[(window.drippsIds.length-1)]]['name'] + " " + "<div id='"+window.drippsIds[(window.drippsIds.length-1)]+"' class='rm'>X</div></div>");
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

                            window.autoCompleteGroups = window.groupList;
                            $(function() {
                                $("#tags").autocomplete({
                                    source: window.autoCompleteGroups
                                });
                            });
                            $("#tags").autocomplete( "option", "minLength", 1);
                            $("#tags").autocomplete({ autoFocus: true });

                            $("#sendBtn").click(function(){
                                if ($("#link").val()) {
                                    if ($("#title").val()) {
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
                                            var content = $('#messageInput3').val();
                                            for (var i = 0; i < content.length; i++) {
                                                if(content[i] == "\"") {
                                                    content = content.substring(0, i) + "'" + content.substring(i+1);
                                                }
                                            }
                                            $('#messageInput3').val('');
                                            $.ajax({
                                                url: window.address + 'sendDripp/new',
                                                data: {groupsDict: JSON.stringify(selGroupsDict), headline: $("#title").val(), imgUrl: $("#img").val(), url: $("#link").val(), source: $("#src").val(), category:"null", fromUserId: window.myID, recipientFriendIds: window.drippsIds, recipientGroup: window.selGroups, content: content},
                                                type:'get'
                                            });
                                            
                                            window.drippsChosenFriends = {};
                                            window.drippsIds=[];
                                            window.selGroups = [];
                                            $('#chosen_ext').html('');
                                            $('#myModal12').modal('show');
                                            setTimeout(function() {
                                                $('#myModal12').modal('hide');
                                            }, 3000);
                                        }
                                        else {
                                            $('#myModal9').modal('show');
                                        setTimeout(function() {
                                            $('#myModal9').modal('hide');
                                        }, 3000);
                                        return;
                                        }
                                    }
                                    else {
                                        $('#myModal7').modal('show');
                                        setTimeout(function() {
                                            $('#myModal7').modal('hide');
                                        }, 3000);
                                        return;
                                    }
                                }
                                else {
                                    $('#myModal8').modal('show');
                                    setTimeout(function() {
                                        $('#myModal8').modal('hide');
                                    }, 3000);
                                    return;
                                }                       
                            });


                            // read it later
                            $(".grey3").click(function(){
                                if ($("#link").val()) {
                                    if ($("#title").val()) {
                                        $.ajax({
                                            url: window.address + 'readItLater/new',
                                            data: {headline: $("#title").val(), imgUrl: $("#img").val(), url: $("#link").val(), source: $("#src").val(), category:"null", userId: window.myID},
                                            type:'get'
                                        });
                                        $(".grey3").attr("class", "opinionButtons grey3 hide");
                                        $(".blue3").attr("class", "opinionButtons blue3");
                                    }
                                    else {
                                        $('#myModal10').modal('show');
                                        setTimeout(function() {
                                            $('#myModal10').modal('hide');
                                        }, 3000);
                                        return;
                                    }
                                }
                                else {
                                    $('#myModal11').modal('show');
                                    setTimeout(function() {
                                        $('#myModal11').modal('hide');
                                    }, 3000);
                                    return;
                                }
                            });
                        }

                        window.GROUP_METHOD.loadGroups();
                        
                        
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





