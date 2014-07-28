var mysql = require('mysql');
var express = require("express");
var app = express();
var connection;


/* testing mysql ajax */
 app.post("/articles", function(req, res) {
    req.setEncoding('utf8');
    req.on('data', function(chunk) {
        data = JSON.parse(chunk);

        var userId = data.user;
        var numArticles = data.numArticles;
        if (data.lastId) {
            var lastId = data.lastId;
        }
        else {
            var lastId = 0;
        }

        var article_query = "SELECT DISTINCT headline, imgUrl, url, source, category, Articles.id, date, numLikes, numDislikes, l1.userId AS l_user, d1.userId AS d_user, b1.userId as b_user FROM Articles LEFT JOIN (SELECT * FROM Likes WHERE Likes.userId ="+userId+ ") AS l1 ON l1.articleId = Articles.id LEFT JOIN (SELECT * FROM Dislikes WHERE Dislikes.userId = "+userId+ ") AS d1 ON d1.articleId = Articles.id LEFT JOIN (SELECT * FROM Buckets WHERE bucketId = -1 AND Buckets.userId = "+userId+ ") AS b1 ON b1.articleId = Articles.id WHERE collected=1 AND Articles.id > " +lastId + " AND date>NOW() - INTERVAL 1 DAY LIMIT " + numArticles;

        connection.query(article_query, function(err,rows,fields) {
            if(err) throw err;
        
            var articles_dict = {};
            var articles_list = [];
            for(var ii=0; ii < rows.length; ii++){
                articles_dict[rows[ii].id] = rows[ii];
                articles_dict[rows[ii].id]["userLiked"] = (rows[ii]['l_user'] != null);
                articles_dict[rows[ii].id]["userDisliked"] = (rows[ii]['d_user'] != null);
                articles_dict[rows[ii].id]["userReadItLater"] = (rows[ii]['b_user'] != null);

                articles_list.push(articles_dict[rows[ii].id]);
            }
            res.send(articles_list);
        });
    });
});

app.post("/articles/:category", function(req, res) {

    req.setEncoding('utf8');
    req.on('data', function(chunk) {
        data = JSON.parse(chunk);


        var userId = data.user;
        var numArticles = data.numArticles;
        var category = req.params.category;
        var lastId = data.lastId;

        var article_query = "SELECT DISTINCT headline, imgUrl, url, source, category, Articles.id, date, numLikes, numDislikes, l1.userId AS l_user, d1.userId AS d_user, b1.userId as b_user FROM Articles LEFT JOIN (SELECT * FROM Likes WHERE Likes.userId ="+userId+ ") AS l1 ON l1.articleId = Articles.id LEFT JOIN (SELECT * FROM Dislikes WHERE Dislikes.userId = "+userId+ ") AS d1 ON d1.articleId = Articles.id LEFT JOIN (SELECT * FROM Buckets WHERE bucketId = -1 AND Buckets.userId = "+userId+ ") AS b1 ON b1.articleId = Articles.id WHERE collected=1 AND Articles.id >" + lastId + " AND category = '"+category +"' AND date>NOW() - INTERVAL 1 DAY LIMIT " + numArticles;
        connection.query(article_query, function(err,rows,fields) {
        if(err) throw err;

        var articles_dict = {};
        var articles_list = [];
        for(var ii=0; ii < rows.length; ii++){
        articles_dict[rows[ii].id] = rows[ii];
        articles_dict[rows[ii].id]["userLiked"] = (rows[ii]['l_user'] != null);
        articles_dict[rows[ii].id]["userDisliked"] = (rows[ii]['d_user'] != null);
        articles_dict[rows[ii].id]["userReadItLater"] = (rows[ii]['b_user'] != null);

        articles_list.push( articles_dict[rows[ii].id]);
        }
        res.send(articles_list);


        });
    });
});

/* sends a list of bucket contents */
app.get("/buckets", function(req, res){
    var userId = req.query.user;

    var get_bucket_articles = "SELECT DISTINCT Buckets.id, bucketId, Buckets.articleId, Buckets.name, dateAdded, date, headline, source, url, imgUrl, numLikes, numDislikes, l1.userId AS l_user, d1.userId As d_user FROM (Buckets INNER JOIN Articles ON Buckets.articleId = Articles.id LEFT JOIN (SELECT * FROM Likes WHERE Likes.userId=" + userId + ") AS l1 ON l1.articleId = Buckets.articleId LEFT JOIN (SELECT * FROM Dislikes WHERE Dislikes.userId=" + userId + ") AS d1 ON d1.articleId = Buckets.articleId) WHERE Buckets.userId=" + userId + " ORDER BY dateAdded DESC";
   
   connection.query(get_bucket_articles, function(err,rows,fields) {
            if (err) throw err;
            var articles_dict = {};
            var articles_list = [];
            for(var ii=0; ii < rows.length; ii++){
                articles_dict[rows[ii].id] = rows[ii];
                articles_dict[rows[ii].id]["userLiked"] = (rows[ii]['l_user'] != null);
                articles_dict[rows[ii].id]["userDisliked"] = (rows[ii]['d_user'] != null);
                articles_dict[rows[ii].id]["isReadItLater"] = true;
                //if there are other buckets need to note readitlater
                articles_list.push( articles_dict[rows[ii].id]);
            }
            res.send(articles_list);
    });

});

app.get("/dripps", function(req, res){
    var userId = req.query.user;
    var get_inbox_articles_query = "SELECT DISTINCT Dripps.id, Dripps.articleId, Users.fullName, isReal, fromUserId, headline, source, url, imgUrl, numLikes, numDislikes, date, collected, Dripps.conversationId, recipientGroup, recipientFriendIds, timeSent, inInbox, unreadDripps, unreadComments, l1.userId AS l_user, d1.userId As d_user, b1.userId AS b_user FROM (Dripps INNER JOIN Articles ON Dripps.articleId = Articles.id INNER JOIN Users ON Users.id = Dripps.fromUserId LEFT JOIN (SELECT * FROM Likes WHERE Likes.userId=" + userId + ") AS l1 ON l1.articleId = Dripps.articleId LEFT JOIN (SELECT * FROM Dislikes WHERE Dislikes.userId=" + userId + ") AS d1 ON d1.articleId = Dripps.articleId)  LEFT JOIN (SELECT * FROM Buckets WHERE bucketId = -1 AND Buckets.userId = "+userId+ ") AS b1 ON b1.articleId = Articles.id WHERE recipientUserId=" + userId + " ORDER BY unreadDripps DESC, unreadComments DESC, Dripps.timeSent DESC";
    
    
    connection.query(get_inbox_articles_query, function(err,rows,fields) {
        if (err) throw err;
        var articles_dict = {};
        var articles_list = [];
        var members = "";
        // //console.log(rows);
        for(var ii=0; ii < rows.length; ii++){
            articles_dict[rows[ii].id] = rows[ii];
            articles_dict[rows[ii].id]["userLiked"] = (rows[ii]['l_user'] != null);
            articles_dict[rows[ii].id]["userDisliked"] = (rows[ii]['d_user'] != null);
            articles_dict[rows[ii].id]["userReadItLater"] = (rows[ii]['b_user'] != null);
            articles_dict[rows[ii].id]["isSender"] = (rows[ii]["fromUserId"] == userId);
            articles_dict[rows[ii].id]["inInbox"] = (rows[ii]["inInbox"] == 1);
            articles_dict[rows[ii].id]["unreadComments"] = (rows[ii]["unreadComments"] == 1);
            articles_dict[rows[ii].id]["unreadDripps"] = (rows[ii]["unreadDripps"] == 1);

            articles_list.push( articles_dict[rows[ii].id]);
            members += "," + rows[ii]['recipientFriendIds'];
            members += "," + rows[ii]['fromUserId'];
        }
        members = "(" + members.slice(1) + ")";
        if (rows.length > 0) {        
            var get_names_query = "select fullName, id from Users Where id in " + members;
            connection.query(get_names_query, function(err,rows,fields) {
                if (err) throw err; 
                res.send({article: articles_list, names: rows});
                //console.log(articles_list);
            });
        } else{
            res.send({article: [], names: []});
        }
    });
});

app.get("/isRead", function(req, res){
    var drippId = req.query.drippId;
    var update_isRead = "UPDATE Dripps SET unreadComments = 0, unreadDripps = 0 WHERE id =" + drippId;
    connection.query(update_isRead, function(err,rows,fields) {
        if (err) throw err;          
        res.send(200);
    });
});

/* sends a list of (from content, conversationId, fName, lName, time ) ordered by time */
app.get("/conversations",  function(req, res){
    var userId = req.query.user;
    
    var get_conversations_articles_query = "SELECT content, Conversations.conversationId, Users.fullName, Conversations.userId, time FROM Conversations INNER JOIN Users On Conversations.userId = Users.id INNER JOIN (SELECT Dripps.conversationId FROM Dripps WHERE recipientUserId =" + userId +") AS d1 ON d1.conversationId = Conversations.conversationId ORDER BY Conversations.time";
    connection.query(get_conversations_articles_query, function(err,rows,fields) {
        if (err) throw err;
        res.send(rows);

    });    
            
});

/* sends a list of (from content, conversationId, fName, lName, time ) ordered by time */
app.get("/is_user",  function(req, res){
    var uid = req.query.uid;
    var fName = req.query.fName;
    var lName = req.query.lName;
    var name = req.query.name;
    var email = req.query.email;
    var get_is_user_query = "SELECT * FROM Users WHERE id = " + uid;
    connection.query(get_is_user_query, function(err,rows,fields) {
        if (err) throw err;
        if (rows.length === 0) { //we're a brand new user
            var add_user_query = "INSERT INTO Users (id, fName, lName, isReal, fullName, email, emailable, created, lastLoginTime) VALUES (" + uid + ",'" + fName + "','" + lName + "',1,'" + name + "','" + email + "',1, NOW(), NOW())";
            connection.query(add_user_query, function(err,rows,fields) {
                if (err) throw err;
                res.send(200);
            });
        } else if (!rows[0].isReal) { //looks like we were a SHADOW USER
            var make_real_query = "UPDATE Users SET isReal=1, fName='" + fName + "',lName='" + lName + "',email='" + email + "',emailable=1, created=NOW(), lastLoginTime=NOW()" + " WHERE id=" + uid;
            connection.query(make_real_query, function(err,rows,fields) {
                if (err) throw err;
                res.send(200);
            });

        }
        res.send(200);

    });
});


app.post("/shadow_users",  function(req, res){
    req.setEncoding('utf8');
    req.on('data', function(chunk) {
        data = JSON.parse(chunk);
        var friend_id_lst = data["lst"];
        var friend_id_string = friend_id_lst.join();
        var get_real_query = "SELECT * FROM Users WHERE id IN(" + friend_id_string + ")";
        connection.query(get_real_query, function(err,rows,fields) {
            if (err) throw err;
            res.send(rows);

        });
    
    
    });
    
});

app.get("/add_shadow_user",  function(req, res){
    var friend_id = req.query.id;
    var name = req.query.name;

    var select_user_query = "SELECT id FROM Users WHERE id=" + friend_id;
    connection.query(select_user_query, function(err,rows,fields) {
        if (err) throw err;
        if (!(rows.length > 0)) {
            var add_shadow_query = "INSERT INTO Users VALUES('" + friend_id + "','','',0,\""+name+"\")";
            connection.query(add_shadow_query, function(err,rows,fields) {
                if (err) throw err;

            });
        } 
        res.send(200);

    });
});

/* -----------------------------------------------*/
app.get("/likes", function(req, res) {
    var userId = req.param('user');
    var articleId = req.query.article;

    var set_likes_query = 'INSERT INTO Likes (userId, articleId) VALUES (' +userId + ',' +  articleId + ')';
    connection.query(set_likes_query, function(err,rows,fields) {
    		if (err) throw err;
    });

    var get_article_query = 'SELECT numLikes FROM Articles WHERE id=' + articleId;
    connection.query(get_article_query, function(err,rows,fields) {
		if (err) throw err;
		var numLikes = rows[0].numLikes;
	    numLikes++;
	    var update_article_query = 'UPDATE Articles SET numLikes=' + numLikes + ' WHERE id=' + articleId;

	    connection.query(update_article_query, function(err,rows,fields) {
	    	if (err) throw err;
	    	res.send(200);
	    });
    }); 
});

app.get("/removeLikes", function(req, res) {
    var userId = req.param('user');
    var articleId = req.query.article;

    var set_likes_query = 'DELETE FROM Likes WHERE userId =' +userId + ' AND articleId = ' +  articleId + " LIMIT 1";
    connection.query(set_likes_query, function(err,rows,fields) {
            if (err) throw err;
    });
    var get_article_query = 'SELECT numLikes FROM Articles WHERE id=' + articleId;
    connection.query(get_article_query, function(err,rows,fields) {
        if (err) throw err;
        var numLikes = rows[0].numLikes;
        numLikes--;
        var update_article_query = 'UPDATE Articles SET numLikes=' + numLikes + ' WHERE id=' + articleId;

        connection.query(update_article_query, function(err,rows,fields) {
            if (err) throw err;
            res.send(200);
        });
    }); 
});

app.get("/dislikes", function(req, res) {
    var userId = req.param('user');
    var articleId = req.query.article;

    var set_dislikes_query = 'INSERT INTO Dislikes (userId, articleId) VALUES (' +userId + ',' +  articleId + ')';
    connection.query(set_dislikes_query, function(err,rows,fields) {
            if (err) throw err;
    });

    var get_article_query = 'SELECT numDislikes FROM Articles WHERE id=' + articleId;
    connection.query(get_article_query, function(err,rows,fields) {
        if (err) throw err;
        var numDislikes = rows[0].numDislikes;
        numDislikes++;
        var update_article_query = 'UPDATE Articles SET numDislikes=' + numDislikes + ' WHERE id=' + articleId;

        connection.query(update_article_query, function(err,rows,fields) {
            if (err) throw err;
            res.send(200);
        });
    }); 
});

app.get("/removeDislikes", function(req, res) {
    var userId = req.param('user');
    var articleId = req.query.article;

    var set_dislikes_query = 'DELETE FROM Dislikes WHERE userId =' +userId + ' AND articleId = ' +  articleId + " LIMIT 1";
    connection.query(set_dislikes_query, function(err,rows,fields) {
            if (err) throw err;
    });

    var get_article_query = 'SELECT numDislikes FROM Articles WHERE id=' + articleId;
    connection.query(get_article_query, function(err,rows,fields) {
        if (err) throw err;
        var numDislikes = rows[0].numDislikes;
        numDislikes--;
        var update_article_query = 'UPDATE Articles SET numDislikes=' + numDislikes + ' WHERE id=' + articleId;

        connection.query(update_article_query, function(err,rows,fields) {
            if (err) throw err;
            res.send(200);
        });
    }); 
});


// handle any friends (as a group) and any groups (separately)
app.get("/sendDripp", function(req, res) {
    var fromUserId = req.query.fromUserId;
    var recipientGroup = req.query.recipientGroup;
    var recipientFriendIds = req.query.recipientFriendIds;
    var articleId = req.query.articleId;
    var selGroupsDict = JSON.parse(req.query.groupsDict);
    var convoId;
    var set_send_query;

    var content = req.query.content;
    if (content) {
        var unreadComments = 1;
    }else{
        unreadComments = 0;
    }

    if (recipientFriendIds) {
        var max_id_query = "SELECT MAX(conversationId) FROM Dripps";
        connection.query(max_id_query, function(err,rows,fields) {
            if (err) throw err;
            if (rows[0]['MAX(conversationId)'] == null) {
                convoId = 0;
            }else{
                convoId = 1 + parseInt(rows[0]['MAX(conversationId)']);
                
            }

            for(var jj=0; jj < recipientFriendIds.length; jj++){
                set_send_query = "INSERT INTO Dripps (recipientUserId, fromUserId, recipientGroup, recipientFriendIds, articleId, timeSent, conversationId,  unreadComments, unreadDripps, inInbox) VALUES (" 
                    + recipientFriendIds[jj] + "," +  fromUserId+ ",-1,'" + recipientFriendIds + "'," +  articleId + ", NOW()," + convoId + "," + unreadComments + ", 1, 1)";
                connection.query(set_send_query, function(err,rows,fields) {
                    if (err) throw err;
                });   
            }
            set_send_query = "INSERT INTO Dripps (recipientUserId, fromUserId, recipientGroup, recipientFriendIds, articleId, timeSent, conversationId,  unreadComments, unreadDripps, inInbox) VALUES (" 
                    + fromUserId + "," +  fromUserId + ",-1,'" + recipientFriendIds + "'," +  articleId + ", NOW()," + convoId + ",0, 0, 0)";
            connection.query(set_send_query, function(err,rows,fields) {
                if (err) throw err;
                var set_convo_query = 'INSERT INTO Conversations (conversationId, userId, time, content) VALUES (' +convoId + ',' +  fromUserId + ", NOW(),\"" + content + "\")";
                connection.query(set_convo_query, function(err,rows,fields) {
                    if (err) throw err;
                });

                //start the group stuff
                if (recipientGroup) {
                    var max_id_query = "SELECT MAX(conversationId) FROM Dripps";
                    connection.query(max_id_query, function(err,rows,fields) {
                        if (rows[0]['MAX(conversationId)'] == null) {
                            convoId = 0;
                        }else{
                            convoId = parseInt(rows[0]['MAX(conversationId)']);   
                        }
                        if (err) throw err;
                        //loop through each group
                        for (var aa = 0; aa < recipientGroup.length; aa++) {
                            convoId += 1;
                            recipientFriendIds = selGroupsDict[recipientGroup[aa]];
                            for (var kk = 0; kk < recipientFriendIds.length; kk++) {  
                                set_send_query = "INSERT INTO Dripps (recipientUserId, fromUserId, recipientGroup, recipientFriendIds, articleId, timeSent, conversationId,  unreadComments, unreadDripps, inInbox) VALUES ('" 
                                    + recipientFriendIds[kk] + "','" +  fromUserId+ "','" + recipientGroup[aa] + "','" + "" +recipientFriendIds + "'," +  articleId + ", NOW()," + convoId + "," + unreadComments + ", 1, 1)";
                                connection.query(set_send_query, function(err,rows,fields) {
                                    if (err) throw err;
                                });
                            }
                            set_send_query2 = "INSERT INTO Dripps (recipientUserId, fromUserId, recipientGroup, recipientFriendIds, articleId, timeSent, conversationId,  unreadComments, unreadDripps, inInbox) VALUES ('" + fromUserId + "','" +  fromUserId + "','" + recipientGroup[aa] + "','" + "" + recipientFriendIds + "'," +  articleId + ", NOW()," + convoId + ",0, 0, 0)";
                            connection.query(set_send_query2, function(err,rows,fields) {
                                if (err) throw err;
                            });
                            var set_convo_query = 'INSERT INTO Conversations (conversationId, userId, time, content) VALUES (' +convoId + ',' +  fromUserId + ", NOW(),\"" + content + "\")";
                            connection.query(set_convo_query, function(err,rows,fields) {
                                if (err) throw err;
                            });
                        }
                    });
                    res.send(200);
                }   
                else {
                    res.send(200);
                }
            });   
        });
    } 

    else {
        var max_id_query = "SELECT MAX(conversationId) FROM Dripps";
        connection.query(max_id_query, function(err,rows,fields) {
            if (rows[0]['MAX(conversationId)'] == null) {
                convoId = 0;
            }else{
                convoId = parseInt(rows[0]['MAX(conversationId)']);   
            }
            if (err) throw err;
            //loop through each group
            for (var aa = 0; aa < recipientGroup.length; aa++) {
                convoId += 1;
                recipientFriendIds = selGroupsDict[recipientGroup[aa]];
                for (var kk = 0; kk < recipientFriendIds.length; kk++) {  
                    set_send_query = "INSERT INTO Dripps (recipientUserId, fromUserId, recipientGroup, recipientFriendIds, articleId, timeSent, conversationId,  unreadComments, unreadDripps, inInbox) VALUES ('" 
                        + recipientFriendIds[kk] + "','" +  fromUserId+ "','" + recipientGroup[aa] + "','" + "" +recipientFriendIds + "'," +  articleId + ", NOW()," + convoId + ",0, 1, 1)";
                    connection.query(set_send_query, function(err,rows,fields) {
                        if (err) throw err;
                    });
                }
                set_send_query2 = "INSERT INTO Dripps (recipientUserId, fromUserId, recipientGroup, recipientFriendIds, articleId, timeSent, conversationId,  unreadComments, unreadDripps, inInbox) VALUES ('" + fromUserId + "','" +  fromUserId + "','" + recipientGroup[aa] + "','" + "" + recipientFriendIds + "'," +  articleId + ", NOW()," + convoId + ",0, 0, 0)";
                connection.query(set_send_query2, function(err,rows,fields) {
                    if (err) throw err;
                });
            }
        });
        res.send(200);
    }
});

app.get("/sendConvo", function(req, res) {
    var conversationId = req.query.conversationId;
    var userId = req.query.userId;
    var content = req.query.content;

    var set_convo_query = 'INSERT INTO Conversations (conversationId, userId, time, content) VALUES (' +conversationId + ',' +  userId + ", NOW(),\"" + content + "\")";
    connection.query(set_convo_query, function(err,rows,fields) {
        if (err) throw err;
        var update_dripp_query = "UPDATE Dripps SET unreadComments = 1, inInbox = 1 WHERE conversationId = " + conversationId + " AND recipientUserId<>" + userId;
        connection.query(update_dripp_query, function(err, rows, fields){
            res.send(200);
        });
    });
});

app.get("/addMembers", function(req, res) {
    var groupName = req.query.groupName;
    var members = req.query.members;
    var creatorId = req.query.creatorId;
    var groupId = req.query.groupId;

    for(var ii=0; ii < members.length; ii++) {    
        var create_group = "INSERT INTO Groups (name, userId, id, creatorId) VALUES (\"" + groupName + "\",'" +  members[ii] + "'," + groupId + ",'" + creatorId + "')";
        connection.query(create_group, function(err,rows,fields) {
            if (err) throw err;
            res.send(200);
        });
    }
});

app.get("/addMembersNew", function(req, res) {
    var groupName = req.query.groupName;
    var members = req.query.members;
    var creatorId = req.query.creatorId;

    var get_group_id = "SELECT DISTINCT id FROM Groups WHERE name = '" + groupName + "' AND creatorId = '" + creatorId + "'";
    connection.query(get_group_id, function(err,rows,fields) {
        if (err) throw err;
        groupId = rows[0].id;
        for(var ii=0; ii < members.length; ii++) {    
            var create_group = "INSERT INTO Groups (name, userId, id, creatorId) VALUES (\"" + groupName + "\",'" +  members[ii] + "'," + groupId + ",'" + creatorId + "')";
            connection.query(create_group, function(err,rows,fields) {
                if (err) throw err;
                res.send(200);
            });
        }
    });
});

app.get("/createGroup", function(req, res) {
    var groupName = req.query.groupName;
    var members = req.query.members;
    var creatorId = req.query.creatorId;

    var get_max_id = "SELECT MAX(id) as id FROM Groups";
    connection.query(get_max_id, function(err,rows,fields) {
        if (err) throw err;
        var next_id = parseInt(rows[0]["id"]) ? parseInt(rows[0]["id"]) + 1 : 1;

        for(var ii=0; ii < members.length; ii++) {    
            var create_group = "INSERT INTO Groups (name, userId, id, creatorId) VALUES (\"" + groupName + "\",'" +  members[ii] + "'," + next_id + ",'" + creatorId + "')";
            connection.query(create_group, function(err,rows,fields) {
                if (err) throw err;
            });
        }
        res.send(200);
    });
});

app.get("/deleteGroup", function(req, res) {
    var groupId = req.query.groupId;

    var delete_group = 'DELETE FROM Groups WHERE id =' + groupId;
    connection.query(delete_group, function(err,rows,fields) {
        if (err) throw err;
        res.send(200);
    });
    var delete_records = "DELETE FROM Dripps WHERE recipientGroup = " + groupId;
    connection.query(delete_records, function(err,rows,fields) {
        if (err) throw err;
        res.send(200);
    });
});

app.get("/deleteNewGroup", function(req, res) {
    var creatorId = req.query.creatorId;
    var groupName = req.query.groupName;
    try{
        var get_group_id = "SELECT DISTINCT id FROM Groups WHERE creatorId ='" + creatorId + "' AND name = '" + groupName + "'";
        connection.query(get_group_id, function(err,rows,fields) {
            if (err) throw err;
            groupId = rows[0].id;
            var delete_group = 'DELETE FROM Groups WHERE id =' + groupId;
            connection.query(delete_group, function(err,rows,fields) {
                if (err) throw err;
            });
            var delete_records = "DELETE FROM Dripps WHERE recipientGroup = " + groupId;
            connection.query(delete_records, function(err,rows,fields) {
                if (err) throw err;
                res.send(200);
            });
        });
    }
    catch(e) {
        return;
    }
});

app.get("/leaveGroup", function(req, res) {
    var groupId = req.query.groupId;
    var myId = req.query.myId;

    var leave_group = 'DELETE FROM Groups WHERE id =' + groupId + " AND userId = '" + myId + "'";
    connection.query(leave_group, function(err,rows,fields) {
        if (err) throw err;
        res.send(200);
    });
    var delete_records = "DELETE FROM Dripps WHERE recipientGroup = " + groupId + " AND recipientUserId = " + myId;
    connection.query(delete_records, function(err,rows,fields) {
        if (err) throw err;
        res.send(200);
    });
});

app.get("/groups", function(req, res) {
    var userId = req.query.userId;

    var members_info_query = "SELECT Groups.id, Groups.creatorId, Groups.name, Groups.userId, fName, lName, fullName, isReal from Groups INNER JOIN Users on Users.id=Groups.userId INNER JOIN (SELECT * FROM Groups WHERE Groups.userId="+userId+") AS g1 ON g1.id = Groups.id";
    connection.query(members_info_query, function(err,rows,fields) {
        if (err) throw err;
        res.send({data: rows, me: userId});
    });
});

  
//for chrome extension, probably
app.get("/sendDripp/new", function(req, res) {

    var headline = req.query.headline;
    var imgUrl = (req.query.imgUrl == null) ? "images/dropBlue.svg" : req.query.imgUrl;
    var url = req.query.url;
    var source = req.query.source;
    var category = req.query.category;
    var fromUserId = req.query.fromUserId;
    var recipientGroup = req.query.recipientGroup;
    var recipientFriendIds = req.query.recipientFriendIds;
    var selGroupsDict = JSON.parse(req.query.groupsDict);
    var convoId;
    var set_send_query;
    var content = req.query.content;
    if (content) {
        var unreadComments = 1;
    }else{
        unreadComments = 0;
    }

    var add_article_query = "INSERT INTO Articles (headline, imgUrl, url, source, category, date, numLikes, numDislikes, collected) VALUES ('"+headline+"','"+imgUrl+"','"+url+"','"+source+"','"+category+"','', 0, 0, 0)";
    connection.query(add_article_query, function(err,result) {
        if (err) throw err;
        var articleId = result.insertId;
        if (recipientFriendIds) {
            var max_id_query = "SELECT MAX(conversationId) FROM Dripps";
            connection.query(max_id_query, function(err,rows,fields) {
                if (err) throw err;
                if (rows[0]['MAX(conversationId)'] == null) {
                    convoId = 0;
                }else{
                    convoId = 1 + parseInt(rows[0]['MAX(conversationId)']);
                    
                }

                for(var jj=0; jj < recipientFriendIds.length; jj++){
                    set_send_query = "INSERT INTO Dripps (recipientUserId, fromUserId, recipientGroup, recipientFriendIds, articleId, timeSent, conversationId,  unreadComments, unreadDripps, inInbox) VALUES ('"
                        + recipientFriendIds[jj] + "','" +  fromUserId+ "',-1,'" + recipientFriendIds + "'," +  articleId + ", NOW()," + convoId + ",0, 1, 1)";
                    connection.query(set_send_query, function(err,rows,fields) {
                        if (err) throw err;
                    });   
                }
                set_send_query = "INSERT INTO Dripps (recipientUserId, fromUserId, recipientGroup, recipientFriendIds, articleId, timeSent, conversationId,  unreadComments, unreadDripps, inInbox) VALUES ('" 
                        + fromUserId + "','" +  fromUserId + "',-1,'" + recipientFriendIds + "'," +  articleId + ", NOW()," + convoId + ",0, 0, 0)";
                connection.query(set_send_query, function(err,rows,fields) {
                    if (err) throw err;
                    var set_convo_query = 'INSERT INTO Conversations (conversationId, userId, time, content) VALUES (' +convoId + ',' +  fromUserId + ", NOW(),\"" + content + "\")";
                    connection.query(set_convo_query, function(err,rows,fields) {
                        if (err) throw err;
                    });

                    //start the group stuff
                    if (recipientGroup) {
                        var max_id_query = "SELECT MAX(conversationId) FROM Dripps";
                        connection.query(max_id_query, function(err,rows,fields) {
                            if (rows[0]['MAX(conversationId)'] == null) {
                                convoId = 0;
                            }else{
                                convoId = parseInt(rows[0]['MAX(conversationId)']);   
                            }
                            if (err) throw err;
                            //loop through each group
                            for (var aa = 0; aa < recipientGroup.length; aa++) {
                                convoId += 1;
                                recipientFriendIds = selGroupsDict[recipientGroup[aa]];
                                for (var kk = 0; kk < recipientFriendIds.length; kk++) {  
                                    set_send_query = "INSERT INTO Dripps (recipientUserId, fromUserId, recipientGroup, recipientFriendIds, articleId, timeSent, conversationId,  unreadComments, unreadDripps, inInbox) VALUES ('" 
                                        + recipientFriendIds[kk] + "','" +  fromUserId+ "','" + recipientGroup[aa] + "','" + "" +recipientFriendIds + "'," +  articleId + ", NOW()," + convoId + ",0, 1, 1)";
                                    connection.query(set_send_query, function(err,rows,fields) {
                                        if (err) throw err;
                                    });
                                }
                                set_send_query2 = "INSERT INTO Dripps (recipientUserId, fromUserId, recipientGroup, recipientFriendIds, articleId, timeSent, conversationId,  unreadComments, unreadDripps, inInbox) VALUES ('" + fromUserId + "','" +  fromUserId + "','" + recipientGroup[aa] + "','" + "" + recipientFriendIds + "'," +  articleId + ", NOW()," + convoId + ",0, 0, 0)";
                                connection.query(set_send_query2, function(err,rows,fields) {
                                    if (err) throw err;
                                });
                                var set_convo_query = 'INSERT INTO Conversations (conversationId, userId, time, content) VALUES (' +convoId + ',' +  fromUserId + ", NOW(),\"" + content + "\")";
                                connection.query(set_convo_query, function(err,rows,fields) {
                                    if (err) throw err;
                                });
                            }
                        });
                        res.send(200);
                    }   
                    else {
                        res.send(200);
                    }
                });   
            });
        } 

        else {
            var max_id_query = "SELECT MAX(conversationId) FROM Dripps";
            connection.query(max_id_query, function(err,rows,fields) {
                if (rows[0]['MAX(conversationId)'] == null) {
                    convoId = 0;
                }else{
                    convoId = parseInt(rows[0]['MAX(conversationId)']);   
                }
                if (err) throw err;
                //loop through each group
                for (var aa = 0; aa < recipientGroup.length; aa++) {
                    convoId += 1;
                    recipientFriendIds = selGroupsDict[recipientGroup[aa]];
                    for (var kk = 0; kk < recipientFriendIds.length; kk++) {  
                        set_send_query = "INSERT INTO Dripps (recipientUserId, fromUserId, recipientGroup, recipientFriendIds, articleId, timeSent, conversationId,  unreadComments, unreadDripps, inInbox) VALUES ('" 
                            + recipientFriendIds[kk] + "','" +  fromUserId+ "','" + recipientGroup[aa] + "','" + "" +recipientFriendIds + "'," +  articleId + ", NOW()," + convoId + ",0, 1, 1)";
                        connection.query(set_send_query, function(err,rows,fields) {
                            if (err) throw err;
                        });
                    }
                    set_send_query2 = "INSERT INTO Dripps (recipientUserId, fromUserId, recipientGroup, recipientFriendIds, articleId, timeSent, conversationId,  unreadComments, unreadDripps, inInbox) VALUES ('" + fromUserId + "','" +  fromUserId + "','" + recipientGroup[aa] + "','" + "" + recipientFriendIds + "'," +  articleId + ", NOW()," + convoId + ",0, 0, 0)";
                    connection.query(set_send_query2, function(err,rows,fields) {
                        if (err) throw err;
                    });
                }
            });
            res.send(200);
        }

    });

});




app.get("/readItLater/new", function(req, res) {
    var headline = req.query.headline;
    var imgUrl = (req.query.imgUrl == null) ? "images/dropBlue.svg" : req.query.imgUrl;
    var url = req.query.url;
    var source = req.query.source;
    var category = req.query.category;
    var add_article_query = "INSERT INTO Articles (headline, imgUrl, url, source, category, date, numLikes, numDislikes, collected) VALUES ('"+headline+"','"+imgUrl+"','"+url+"','"+source+"','"+category+"','', 0, 0, 0)";

    connection.query(add_article_query, function(err,result) {
        if (err) throw err;
        var userId = req.query.userId;
        var name = "readItLater";
        var articleId = result.insertId;
        var bucketId = -1;

        var set_read_query = 'INSERT INTO Buckets (userId, name, articleId, dateAdded, bucketId) VALUES (' + userId + ',' + "'" + name+ "'" + ',' +articleId + ", NOW()," +  bucketId + ')';
        connection.query(set_read_query, function(err,rows,fields) {
            if (err) throw err;
            res.send(200);
        });    
        res.send(201);
    });
});


app.get("/readItLater", function(req, res) {
    var userId = req.query.userId;
    var name = "readItLater";
    var articleId = req.query.articleId;
    var bucketId = -1;

    var set_read_query = 'INSERT INTO Buckets (userId, name, articleId, dateAdded, bucketId) VALUES (' + userId + ',' + "'" + name+ "'" + ',' +articleId + ", NOW()," +  bucketId + ')';
    connection.query(set_read_query, function(err,rows,fields) {
        if (err) throw err;
        res.send(200);
    });
});

app.get("/removeReadItLater", function(req, res) {
    var userId = req.query.userId;
    var articleId = req.query.articleId;

    var set_read_query = 'DELETE FROM Buckets WHERE userId =' + userId + ' AND articleId = ' +  articleId + " LIMIT 1";
    connection.query(set_read_query, function(err,rows,fields) {
        if (err) throw err;
        res.send(200);

    });
});


app.get("/unsubscribe", function(req, res) {
    var user_id = req.query.user_id;

    var set_read_query = 'UPDATE Users SET emailable=0 WHERE id =' + user_id + " LIMIT 1";
    connection.query(set_read_query, function(err,rows,fields) {
        if (err) throw err;
        res.send(200);

    });
});

/* -----------------------------------------------*/

 /* serves main page */
app.get("/", function(req, res) {
    res.sendfile(__dirname+'/dripps.html')
});


app.post("/user/add", function(req, res) { 
    /* some server side logic */
    res.send("OK");
});
 
 /* serves all the static files */
app.get(/^(.+)$/, function(req, res){ 
    res.sendfile( __dirname + req.params[0]); 
});
 
var port = process.env.PORT || 5000;
 
app.listen(port, function() {

    connection = mysql.createConnection({
    host  : '54.86.82.21', 
    user:'root',
    password:'drippr',
    database:'drippr_db'
    });

    connection.connect(function(err) {
    });
});