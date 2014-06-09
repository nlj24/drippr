window.GROUP_METHOD = {
    
    groupData:function(res) {
        console.log("fdsfdfaffaffewjfhaweh");
        var data = res.data;
        var me = res.me;
        window.my_members_dict = {};
        window.groupList = [];
        window.other_members_dict = {};

        window.groupListDict = {};

        for (var jj = 0; jj < data.length; jj++) {

            if(data[jj].creatorId == me) { // I'm the creator
                if (!(window.my_members_dict[data[jj].id])) {
                    window.groupList.push(data[jj].name);
                    window.groupListDict[data[jj].name] = data[jj].id;
                    window.my_members_dict[data[jj].id] = {name: data[jj].name, id: data[jj].id, list:[]};
                }
                    
                id = data[jj].userId;
                userName = data[jj].fullName;
                userId = data[jj].userId;
                window.my_members_dict[data[jj].id]['list'].push({name : userName, userId: userId});

            } else { // I'm just a member

                if (!(window.other_members_dict[data[jj].id])) {
                    window.groupList.push(data[jj].name);
                    window.groupListDict[data[jj].name] = data[jj].id;
                    window.other_members_dict[data[jj].id] = {name: data[jj].name, id: data[jj].id, list:[]};
                }
                    
                id = data[jj].userId;
                userName = data[jj].fullName;
                userId = data[jj].userId;
                window.other_members_dict[data[jj].id]['list'].push({name : userName, userId: userId});

            }

        }

        var templateSource = $("#groups-template").html();
        template = Handlebars.compile(templateSource);
        groupHTML = template({"my_groups":window.my_members_dict, "other_groups":window.other_members_dict});
        $('#groups_placeholder').html(groupHTML);
        $("#my_group_container").height($(window).height()-430);
        $("#other_group_container").height($(window).height()-430);

        if ($.isEmptyObject(window.my_members_dict)) {
            $('#my_group_container').html("you haven't created any groups");
        }

        if ($.isEmptyObject(window.other_members_dict)) {
            $('#other_group_container').html("you haven't been added to any groups");
        }

        for (var ii = 0; ii < data.length; ii++) {
            if (!data[ii]["isReal"]) {
                $("."+data[ii]['userId']).attr("class", "personName red_friends")
            }
            else {
                $("."+data[ii]['userId']).attr("class", "personName blue_friends")
            }
        }

        $(".deleteGroup").click(function(e){
            var groupId = $(e.target).attr('group_id');
            delete window.my_members_dict[groupId];
            var groupRowHeight = $("[group_id=" + "group_" + groupId + "]").height();
            $("[group_id=" + "group_" + groupId + "]").html("<div class = 'groupDeletionStyle'> your group was deleted.</div>");
            $("[group_id=" + "group_" + groupId + "]").height(groupRowHeight);
            setTimeout(function() {
                $("[group_id=" + "group_" + groupId + "]").fadeOut(400, function() {
                    $("[group_id=" + "group_" + groupId + "]").remove();
                    $(".groupRowStyle:nth-of-type(odd)").css("background-color", "azure");
                    $(".groupRowStyle:nth-of-type(even)").css("background-color", "#e9eaed");
                    if ($.isEmptyObject(window.my_members_dict)) {
                        $('#my_group_container').html("you haven't created any groups");
                    }
                });
            }, 3500);
            $.ajax({
                url: window.address + 'deleteGroup',
                data: {groupId: groupId},
                method:'get',
                success: function(data){return;}
            });
        });

        $(".leaveGroup").click(function(e){
            var groupId = $(e.target).attr('group_id');
            if (other_members_dict[groupId]['list'].length == 3) {
                $.ajax({
                    url: window.address + 'deleteGroup',
                    data: {groupId: groupId},
                    method:'get',
                    success: function(data){return;}
                });
                alert('need to alert creator that group was deleted');
            }
            delete window.other_members_dict[groupId];
            var groupRowHeight = $("[group_id=" + "group_" + groupId + "]").height();
            $("[group_id=" + "group_" + groupId + "]").html("<div class = 'groupDeletionStyle'> you have left the group.</div>");
            $("[group_id=" + "group_" + groupId + "]").height(groupRowHeight);
            setTimeout(function() {
                $("[group_id=" + "group_" + groupId + "]").fadeOut(400, function() {
                    $("[group_id=" + "group_" + groupId + "]").remove();
                    $(".groupRowStyle:nth-of-type(odd)").css("background-color", "azure");
                    $(".groupRowStyle:nth-of-type(even)").css("background-color", "#e9eaed");
                    if ($.isEmptyObject(window.other_members_dict)) {
                        $('#other_group_container').html("you haven't been added to any groups");
                    }
                });
            }, 5000);
            $.ajax({
                url: window.address + 'leaveGroup',
                data: {groupId: groupId, myId: window.myID},
                method:'get',
                success: function(data){return;}
            });
        });        

        $(function() {
            var availableTags = window.groupList;
            $("#tags").autocomplete({
                source: availableTags
            });
        });
    },
    
    loadGroups:function(){$.ajax({
        url: window.address + 'groups',
        data: {userId: window.myID},
        method:'get',
        success: this.groupData
    }); 
    }
}