var mysql = require('mysql');
var express = require("express");
var app = express();
var connection;


/* testing mysql ajax */
 app.get("/articles", function(req, res) {
    var userId = req.query.user;
    var article_query = "SELECT DISTINCT headline, imgUrl, url, source, category, Articles.id, date, numLikes, numDislikes, l1.userId AS l_user, d1.userId AS d_user, b1.userId as b_user FROM Articles LEFT JOIN (SELECT * FROM Likes WHERE Likes.userId ="+userId+ ") AS l1 ON l1.articleId = Articles.id LEFT JOIN (SELECT * FROM Dislikes WHERE Dislikes.userId = "+userId+ ") AS d1 ON d1.articleId = Articles.id LEFT JOIN (SELECT * FROM Buckets WHERE bucketId = -1 AND Buckets.userId = "+userId+ ") AS b1 ON b1.articleId = Articles.id WHERE collected=1";
   

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

/* sends a list of bucket contents */
app.get("/buckets", function(req, res){
    var userId = req.query.user;

    var get_bucket_articles = "SELECT Buckets.id, bucketId, Buckets.name, dateAdded, headline, source, url, imgUrl, numLikes, numDislikes, l1.userId AS l_user, d1.userId As d_user FROM (Buckets INNER JOIN Articles ON Buckets.articleId = Articles.id LEFT JOIN (SELECT * FROM Likes WHERE Likes.userId=" + userId + ") AS l1 ON l1.articleId = Buckets.articleId LEFT JOIN (SELECT * FROM Dislikes WHERE Dislikes.userId=" + userId + ") AS d1 ON d1.articleId = Buckets.articleId) WHERE Buckets.userId=" + userId;
   
   connection.query(get_bucket_articles, function(err,rows,fields) {
            if (err) throw err;
            var articles_dict = {};
            var articles_list = [];
            for(var ii=0; ii < rows.length; ii++){
                articles_dict[rows[ii].id] = rows[ii];
                articles_dict[rows[ii].id]["userLiked"] = (rows[ii]['l_user'] != null);
                articles_dict[rows[ii].id]["userDisliked"] = (rows[ii]['d_user'] != null);
                //if there are other buckets need to note readitlater
                articles_list.push( articles_dict[rows[ii].id]);
            }

        
                
            res.send(articles_list);
    });

});

/* sends a list of (from name, headline, conversationId ) ordered by time */
app.get("/dripps", function(req, res){
    var userId = req.query.user;
    var get_inbox_articles_query = "SELECT Dripps.id, Dripps.articleId, fName, lName, headline, source, url, imgUrl, numLikes, numDislikes, Dripps.conversationId, recipientGroup, recipientFriendIds, timeSent, isRead, l1.userId AS l_user, d1.userId As d_user, b1.userId AS b_user FROM (Dripps INNER JOIN Articles ON Dripps.articleId = Articles.id INNER JOIN Users ON Users.id = Dripps.fromUserId LEFT JOIN (SELECT * FROM Likes WHERE Likes.userId=" + userId + ") AS l1 ON l1.articleId = Dripps.articleId LEFT JOIN (SELECT * FROM Dislikes WHERE Dislikes.userId=" + userId + ") AS d1 ON d1.articleId = Dripps.articleId)  LEFT JOIN (SELECT * FROM Buckets WHERE bucketId = -1 AND Buckets.userId = "+userId+ ") AS b1 ON b1.articleId = Articles.id WHERE recipientUserId=" + userId + " ORDER BY Dripps.timeSent";
    
    
    connection.query(get_inbox_articles_query, function(err,rows,fields) {
        if (err) throw err;
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

/* sends a list of (from content, conversationId, fName, lName, time ) ordered by time */
app.get("/conversations",  function(req, res){
    var userId = req.query.user;
    
    var get_conversations_articles_query = "SELECT content, Conversations.conversationId, fName, lName, Conversations.userId, time FROM Conversations INNER JOIN Users On Conversations.userId = Users.id INNER JOIN (SELECT Dripps.conversationId FROM Dripps WHERE fromUserId =" + userId +" OR recipientUserId =" + userId +") AS d1 ON d1.conversationId = Conversations.conversationId ORDER BY Conversations.time";
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
    var get_is_user_query = "SELECT * FROM Users WHERE id = " + uid;
    connection.query(get_is_user_query, function(err,rows,fields) {
        if (err) throw err;
        if (rows.length === 0) {
            var add_user_query = "INSERT INTO Users (id, fName, lName) VALUES (" + uid + ",'" + fName + "','" + lName + "')";
            connection.query(add_user_query, function(err,rows,fields) {
                if (err) throw err;
                res.send(200);

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

app.get("/sendDripp", function(req, res) {
    var fromUserId = req.query.fromUserId;
    var recipientGroup = req.query.recipientGroup;
    var recipientFriendIds = req.query.recipientFriendIds;
    var articleId = req.query.articleId;
    var convoId;
    var set_send_query;

    var max_id_query = "SELECT MAX(conversationId) FROM Dripps";
    connection.query(max_id_query, function(err,rows,fields) {
        if (err) throw err;
        if (rows[0]['MAX(conversationId)'] == null) {
            convoId = 0;
        }else{
            convoId = 1 + parseInt(rows[0]['MAX(conversationId)']);
            
        }

        for(var jj=0; jj < recipientFriendIds.length; jj++){
            set_send_query = "INSERT INTO Dripps (recipientUserId, fromUserId, recipientGroup, recipientFriendIds, articleId, timeSent, conversationId, isRead, unreadComments) VALUES (" 
                + recipientFriendIds[jj] + "," +  fromUserId+ "," +recipientGroup + ",'" + recipientFriendIds + "'," +  articleId + ", NOW()," + convoId + ",0, 0)";
            connection.query(set_send_query, function(err,rows,fields) {
                if (err) throw err;
                res.send(200);

            });   
        }
    });
    res.send(201);
});


app.get("/sendConvo", function(req, res) {
    var conversationId = req.query.conversationId;
    var userId = req.query.userId;
    var content = req.query.content;

    var set_convo_query = 'INSERT INTO Conversations (conversationId, userId, time, content) VALUES (' +conversationId + ',' +  userId + ", NOW(),'" + content + "')";
    connection.query(set_convo_query, function(err,rows,fields) {
        if (err) throw err;
        res.send(200);
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
            var create_group = "INSERT INTO Groups (name, userId, id, creatorId) VALUES ('" + groupName + "','" +  members[ii] + "'," + next_id + ",'" + creatorId + "')";
            connection.query(create_group, function(err,rows,fields) {
                if (err) throw err;
                res.send(200);
            });
        }
    });
});

app.get("/deleteGroup", function(req, res) {
    var groupId = req.query.groupId;

    var delete_group = 'DELETE FROM Groups WHERE id =' + groupId;
    connection.query(delete_group, function(err,rows,fields) {
        if (err) throw err;
        res.send(200);
    });
});

app.get("/groups", function(req, res) {
    var userId = req.query.userId;

    var members_info_query = "SELECT Groups.id, Groups.name, Groups.userId, fName, lName from Groups INNER JOIN Users on Users.id=Groups.userId LEFT JOIN (SELECT * FROM Groups WHERE Groups.userId="+userId+") AS g1 ON g1.id = Groups.id";
    connection.query(members_info_query, function(err,rows,fields) {
        if (err) throw err;
        res.send(rows);
    });
});



app.get("/sendDripp/new", function(req, res) {

    var headline = req.query.headline;
    var imgUrl = req.query.imgUrl;
    var url = req.query.url;
    var source = req.query.source;
    var category = req.query.category;

    var add_article_query = "INSERT INTO Articles (headline, imgUrl, url, source, category, date, numLikes, numDislikes, collected) VALUES ("+headline+","+imgUrl+","+url+","+source+","+category+",NOW(), 0, 0, 0)";
    
    connection.query(add_article_query, function(err,result) {
        if (err) throw err;
        var fromUserId = req.query.fromUserId;
        var recipientGroup = req.query.recipientGroup;
        var recipientFriendIds = req.query.recipientFriendIds;
        var articleId = result.insertId;
        var convoId;
        var set_send_query;

        var max_id_query = "SELECT MAX(conversationId) FROM Dripps";
        connection.query(max_id_query, function(err,rows,fields) {
            if (err) throw err;
            if (rows[0]['MAX(conversationId)'] == null) {
                convoId = 0;
            }else{
                convoId = 1 + parseInt(rows[0]['MAX(conversationId)']);
                
            }

            for(var jj=0; jj < recipientFriendIds.length; jj++){
                set_send_query = "INSERT INTO Dripps (recipientUserId, fromUserId, recipientGroup, recipientFriendIds, articleId, timeSent, conversationId, isRead, unreadComments) VALUES (" 
                    + recipientFriendIds[jj] + "," +  fromUserId+ "," +recipientGroup + ",'" + recipientFriendIds + "'," +  articleId + ", NOW()," + convoId + ",0, 0)";
                connection.query(set_send_query, function(err,rows,fields) {
                    if (err) throw err;
                    res.send(200);

                });   
            }
        });

        res.send(201);
    });


});

app.get("/readItLater/new", function(req, res) {
    var headline = req.query.headline;
    var imgUrl = req.query.imgUrl;
    var url = req.query.url;
    var source = req.query.source;
    var category = req.query.category;
    var add_article_query = "INSERT INTO Articles (headline, imgUrl, url, source, category, date, numLikes, numDislikes, collected) VALUES ("+headline+","+imgUrl+","+url+","+source+","+category+",NOW(), 0, 0, 0)";

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