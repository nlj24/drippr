window.GROUP_METHOD = {
    
    groupData:function(res) {
        var data = res.data;
        var me = res.me;
        var my_members_dict = {};
        window.groupList = [];
        var other_members_dict = {};

        window.groupListDict = {};

        for (var jj = 0; jj < data.length; jj++) {

            if(data[jj].creatorId == me) { // I'm the creator
                if (!(my_members_dict[data[jj].id])) {
                    window.groupList.push(data[jj].name);
                    window.groupListDict[data[jj].name] = data[jj].id;
                    my_members_dict[data[jj].id] = {name: data[jj].name, id: data[jj].id, list:[]};
                }
                    
                id = data[jj].userId;
                userName = data[jj].fullName;
                userId = data[jj].userId;
                my_members_dict[data[jj].id]['list'].push({name : userName, userId: userId});

            } else { // I'm just a member

                if (!(other_members_dict[data[jj].id])) {
                    window.groupList.push(data[jj].name);
                    window.groupListDict[data[jj].name] = data[jj].id;
                    other_members_dict[data[jj].id] = {name: data[jj].name, id: data[jj].id, list:[]};
                }
                    
                id = data[jj].userId;
                userName = data[jj].fullName;
                userId = data[jj].userId;
                other_members_dict[data[jj].id]['list'].push({name : userName, userId: userId});

            }

        }

        var templateSource = $("#groups-template").html();
        template = Handlebars.compile(templateSource);
        groupHTML = template({"my_groups":my_members_dict, "other_groups":other_members_dict});
        $('#groups_placeholder').html(groupHTML);
        $("#my_group_container").height($(window).height()-430);
        $("#other_group_container").height($(window).height()-430);

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
            if (groupId == null) {
                alert("doesn't work correctly");
            }
            else {
                var groupRowHeight = $("[group_id=" + "group_" + groupId + "]").height();
                $("[group_id=" + "group_" + groupId + "]").html("<div class = 'groupDeletionStyle'> Your group was deleted.</div>");
                $("[group_id=" + "group_" + groupId + "]").height(groupRowHeight);
                setTimeout(function() {
                    $("[group_id=" + "group_" + groupId + "]").fadeOut(400, function() {
                        $("[group_id=" + "group_" + groupId + "]").remove();
                        $(".groupRowStyle:nth-of-type(odd)").css("background-color", "azure");
                        $(".groupRowStyle:nth-of-type(even)").css("background-color", "#e9eaed");
                    });
                }, 3500);
                $.ajax({
                    url: window.address + 'deleteGroup',
                    data: {groupId: groupId},
                    method:'get',
                    success: function(data){return;}
                });
            }
        });

        $(".leaveGroup").click(function(e){
            var groupId = $(e.target).attr('group_id'); 
            var groupRowHeight = $("[group_id=" + "group_" + groupId + "]").height();
            $("[group_id=" + "group_" + groupId + "]").html("<div class = 'groupDeletionStyle'> You have left the group.</div>");
            $("[group_id=" + "group_" + groupId + "]").height(groupRowHeight);
            setTimeout(function() {
                $("[group_id=" + "group_" + groupId + "]").fadeOut(400, function() {
                    $("[group_id=" + "group_" + groupId + "]").remove();
                    $(".groupRowStyle:nth-of-type(odd)").css("background-color", "azure");
                    $(".groupRowStyle:nth-of-type(even)").css("background-color", "#e9eaed");
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
        $( "#tags" ).autocomplete({
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