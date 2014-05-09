var mysql = require('mysql');
var express = require("express");
var app = express();
var connection;


/* testing mysql ajax */
 app.get("/articles", function(req, res) {
    var userId = req.query.user;
    var article_query = 'SELECT * FROM Articles';
    var like_query = 'SELECT * FROM Likes WHERE userId=' + userId;
    var dislike_query = 'SELECT * FROM Dislikes WHERE userId=' + userId;

    connection.query(article_query, function(err,rows,fields) {
        if(err) throw err;
    
        var articles_dict = {};
        for(var ii=0; ii < rows.length; ii++){
            articles_dict[rows[ii].id] = rows[ii];
            articles_dict[rows[ii].id]["userLiked"] = false;
            articles_dict[rows[ii].id]["userDisliked"] = false;
        }

        //now do other query for likes
        connection.query(like_query, function(err,inner_rows,fields) {
            if(err) throw err;
            for(var jj=0; jj < inner_rows.length; jj++){
                articles_dict[inner_rows[jj].articleId]["userLiked"] = true;
            }
        });

        //now do other query for dislikes
        connection.query(dislike_query, function(err,inner_rows,fields) {
            if(err) throw err;
            for(var jj=0; jj < inner_rows.length; jj++){
                articles_dict[inner_rows[jj].articleId]["userDisliked"] = true;
            }         
            console.log(articles_dict);

            articles_list = [];
            for(var id in articles_dict){
                articles_list.push(articles_dict[id]);
            }

            res.send(articles_list);
        });
   
    });

 });

/* sends a list of bucket contents */
app.get("/buckets", function(req, res){
    var userId = req.param('user');

    var get_bucket_articles = "SELECT Buckets.id, bucketId, Buckets.name, dateAdded, headline, source, url, imgUrl, numLikes, numDislikes FROM Buckets INNER JOIN Articles ON Buckets.articleId = Articles.id WHERE userId=" + userId;
    connection.query(get_bucket_articles, function(err,rows,fields) {
            if (err) throw err;
            res.send(rows);
    });

});

/* sends a list of (from name, headline, conversationId ) ordered by time */
app.get("/dripps", function(req, res){
    var userId = req.param('user');

    var get_inbox_articles_query = "SELECT Dripps.id, fName, lName, headline, source, url, imgUrl, numLikes, numDislikes, Dripps.conversationId, recipientGroup, recipientFriendIds, timeSent, isRead FROM (Dripps INNER JOIN Articles ON Dripps.articleId = Articles.id INNER JOIN Users ON Users.id = Dripps.fromUserId) WHERE recipientUserId=" + userId + " ORDER BY Dripps.timeSent";
    connection.query(get_inbox_articles_query, function(err,rows,fields) {
            if (err) throw err;
            res.send(rows);
    });
});

/* sends a list of (from content, conversationId, fName, lName, time ) ordered by time */
app.get("/conversations",  function(req, res){
    var userId = req.param('user');

    var get_conversations_articles_query = "SELECT content, conversationId, fName, lName, time FROM Conversations INNER JOIN Users ON Conversations.userId = Users.id ORDER BY Conversations.time";
    connection.query(get_conversations_articles_query, function(err,rows,fields) {
            if (err) throw err;
            res.send(rows);
    });
});






/* -----------------------------------------------*/
app.get("/likes", function(req, res) {
    var userId = req.param('user');
    var articleId = req.query.article;

    var set_likes_query = 'INSERT INTO Likes (userId, articleId) VALUES (' +userId + ',' +  articleId + ')';
    connection.query(set_likes_query, function(err,rows,fields) {
    		if (err) throw err;
    		console.log("Inserted into Like table that user " + userId + " liked article " + articleId);
    });

    var get_article_query = 'SELECT numLikes FROM Articles WHERE id=' + articleId;
    console.log(get_article_query);
    connection.query(get_article_query, function(err,rows,fields) {
		if (err) throw err;
		console.log("Article had " + rows[0].numLikes);
		var numLikes = rows[0].numLikes;
	    numLikes++;
	    var update_article_query = 'UPDATE Articles SET numLikes=' + numLikes + ' WHERE id=' + articleId;

	    console.log(update_article_query);
	    connection.query(update_article_query, function(err,rows,fields) {
	    	if (err) throw err;
	    	console.log("Article now has " + numLikes );
	    	res.send(200);
	    });

    }); 
    // res.send(200);
 });

app.get("/removeLikes", function(req, res) {
    var userId = req.param('user');
    var articleId = req.query.article;

    var set_likes_query = 'DELETE FROM Likes WHERE userId =' +userId + ' AND articleId = ' +  articleId + " LIMIT 1";
    console.log(set_likes_query);
    connection.query(set_likes_query, function(err,rows,fields) {
            if (err) throw err;
            console.log("Deleted into Like table that user " + userId + " liked article " + articleId);
    });
    var get_article_query = 'SELECT numLikes FROM Articles WHERE id=' + articleId;
    console.log(get_article_query);
    connection.query(get_article_query, function(err,rows,fields) {
        if (err) throw err;
        console.log("Article had " + rows[0].numLikes);
        var numLikes = rows[0].numLikes;
        numLikes--;
        var update_article_query = 'UPDATE Articles SET numLikes=' + numLikes + ' WHERE id=' + articleId;

        console.log(update_article_query);
        connection.query(update_article_query, function(err,rows,fields) {
            if (err) throw err;
            console.log("Article now has " + numLikes );
            res.send(200);
        });

    }); 
});

app.get("/dislikes", function(req, res) {
    var userId = req.param('user');
    var articleId = req.query.article;

    var set_dislikes_query = 'INSERT INTO Dislikes (userId, articleId) VALUES (' +userId + ',' +  articleId + ')';
    console.log(set_dislikes_query);
    connection.query(set_dislikes_query, function(err,rows,fields) {
            if (err) throw err;
            console.log("Inserted into Dislike table that user " + userId + " disliked article " + articleId);
    });

    var get_article_query = 'SELECT numDislikes FROM Articles WHERE id=' + articleId;
    console.log(get_article_query);
    connection.query(get_article_query, function(err,rows,fields) {
        if (err) throw err;
        console.log("Article had " + rows[0].numDislikes);
        var numDislikes = rows[0].numDislikes;
        numDislikes++;
        var update_article_query = 'UPDATE Articles SET numDislikes=' + numDislikes + ' WHERE id=' + articleId;

        console.log(update_article_query);
        connection.query(update_article_query, function(err,rows,fields) {
            if (err) throw err;
            console.log("Article now has " + numDislikes );
            res.send(200);
        });

    }); 
    // res.send(200);
});

app.get("/removeDislikes", function(req, res) {
    var userId = req.param('user');
    var articleId = req.query.article;

    var set_dislikes_query = 'DELETE FROM Dislikes WHERE userId =' +userId + ' AND articleId = ' +  articleId + " LIMIT 1";
    console.log(set_dislikes_query);
    connection.query(set_dislikes_query, function(err,rows,fields) {
            if (err) throw err;
            console.log("Deleted into Dislike table that user " + userId + " disliked article " + articleId);
    });

    var get_article_query = 'SELECT numDislikes FROM Articles WHERE id=' + articleId;
    console.log(get_article_query);
    connection.query(get_article_query, function(err,rows,fields) {
        if (err) throw err;
        console.log("Article had " + rows[0].numDislikes);
        var numDislikes = rows[0].numDislikes;
        numDislikes--;
        var update_article_query = 'UPDATE Articles SET numDislikes=' + numDislikes + ' WHERE id=' + articleId;

        console.log(update_article_query);
        connection.query(update_article_query, function(err,rows,fields) {
            if (err) throw err;
            console.log("Article now has " + numDislikes );
            res.send(200);
        });

    }); 
    // res.send(200);
});

app.get("/sendDripp", function(req, res) {
    var recipientUserId = req.query.recipientUserId;
    var fromUserId = req.query.fromUserId;
    var recipientGroup = req.query.recipientGroup;
    var recipientFriendIds = req.query.recipientFriendIds;
    var articleId = req.query.articleId;
    var timeSent = req.query.timeSent;
    var conversationId = req.query.conversationId;
    var isRead = req.query.isRead;

    var set_send_query = 'INSERT INTO Dripps (recipientUserId, fromUserId, recipientGroup, recipientFriendIds, articleId, timeSent, conversationId, isRead) VALUES (' + recipientUserId + ',' + fromUserId + ',' +recipientGroup + ',' + recipientFriendIds + ',' +  articleId + ',' + "'" + timeSent + "'" + ',' + conversationId + ',' + isRead + ')';
    console.log(set_send_query);
    connection.query(set_send_query, function(err,rows,fields) {
            if (err) throw err;
            console.log("Inserted into Dripps table that user " + fromUserId + " sent article " + articleId);
    });
});

app.get("/readItLater", function(req, res) {
    var userId = req.query.userId;
    var name = req.query.name;
    var articleId = req.query.articleId;
    var dateAdded = req.query.dateAdded;
    var bucketId = req.query.bucketId;

    var set_read_query = 'INSERT INTO Buckets (userId, name, articleId, dateAdded, bucketId) VALUES (' + userId + ',' + "'" + name+ "'" + ',' +articleId + ',' + "'" + dateAdded + "'" + ',' +  bucketId + ')';
    console.log(set_read_query);
    connection.query(set_read_query, function(err,rows,fields) {
            if (err) throw err;
            console.log("Inserted into Bucket table that user " + userId + " saved article " + articleId);
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
    console.log('static file request : ' + req.params);
    res.sendfile( __dirname + req.params[0]); 
 });
 
 var port = process.env.PORT || 5000;
 
 app.listen(port, function() {
    console.log("Listening on " + port);

    connection = mysql.createConnection({
    host  : '54.86.82.21', 
    user:'root',
    password:'drippr',
    database:'drippr_db'
    });

    connection.connect(function(err) {
    console.log(err);
    });


 });

	
