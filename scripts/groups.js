window.GROUP_METHOD = {
    
    groupData:function(res) {
        var data = res.data;
        var me = res.me;
        console.log("data");
        console.log(data);
        console.log("myId");
        console.log(me);
        var my_members_dict = {};
        window.my_groupList = [];
        var other_members_dict = {};
        window.other_groupList = [];

        window.groupListDict = {};

        for (var jj = 0; jj < data.length; jj++) {

            if(data[jj].creatorId == me) { // I'm the creator
                if (!(my_members_dict[data[jj].id])) {
                    my_members_dict[data[jj].id] = {name: data[jj].name, id: data[jj].id, list:[]};
                }
                    
                id = data[jj].userId;
                userName = data[jj].fullName;
                userId = data[jj].userId;
                my_members_dict[data[jj].id]['list'].push({name : userName, userId: userId});

            } else { // I'm just a member

                if (!(other_members_dict[data[jj].id])) {
                    other_members_dict[data[jj].id] = {name: data[jj].name, id: data[jj].id, list:[]};
                }
                    
                id = data[jj].userId;
                userName = data[jj].fullName;
                userId = data[jj].userId;
                other_members_dict[data[jj].id]['list'].push({name : userName, userId: userId});

            }

        }

        console.log("my group dict...");
        console.log(my_members_dict);
        console.log("other group dict...");
        console.log(other_members_dict);

        var templateSource = $("#my-groups-template").html();
        template = Handlebars.compile(templateSource);
        groupHTML = template({"my_groups":my_members_dict});
        $('#groups_placeholder').html(groupHTML);

        var templateSource = $("#other-groups-template").html();
        template = Handlebars.compile(templateSource);
        groupHTML = template({"other_groups":other_members_dict});
        $('#groups_placeholder').html(groupHTML);

        for (var ii = 0; ii < data.length; ii++) {
            if (!data[ii]["isReal"]) {
                $("."+data[ii]['userId']).attr("class", "personName red_friends")
            }
            else {
                $("."+data[ii]['userId']).attr("class", "personName blue_friends")
            }
        }

        $(".deleteGroup").click(function(e){
            console.log('1');
            var groupId = $(e.target).attr('group_id');
            if (groupId == null) {
                alert("cunt");
            }
            else {
                $("#group_" + groupId).attr("class", "hide");
                $.ajax({
                    url: window.address + 'deleteGroup',
                    data: {groupId: groupId},
                    method:'get',
                    success: function(data){return;}
                });
            }
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