window.GROUP_METHOD = {
    
    groupData:function(data) {
        //(group id -> list of {id:name}?)
        var members_dict = {};
        window.groupList = [];
        window.groupListDict = {};
        for (var jj = 0; jj < data.length; jj++) {

            if (!(members_dict[data[jj].id])) {
                window.groupListDict[data[jj].name] = data[jj].id;
                window.groupList.push(data[jj].name);
                members_dict[data[jj].id] = {name: data[jj].name, id: data[jj].id, list:[]};
            }
                
            id = data[jj].userId;
            userName = data[jj].fName +" "+data[jj].lName ;
            members_dict[data[jj].id]['list'].push({name : userName});
        }

        var templateSource = $("#groups-template").html();
        template = Handlebars.compile(templateSource);
        groupHTML = template({"groups":members_dict});
        $('#groups_placeholder').html(groupHTML);

        $(".deleteGroup").click(function(e){
            var groupId = $(e.target).attr('group_id');
            $("#group_" + groupId).attr("class", "hide");
            $.ajax({
                url: window.address + 'deleteGroup',
                data: {groupId: groupId},
                method:'get',
                success: function(data){return;}
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