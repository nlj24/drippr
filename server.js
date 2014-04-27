var mysql = require('mysql');
var express = require("express");
var app = express();
var connection;


/* testing mysql ajax */
 app.get("/articles", function(req, res) {
    var userId = req.query.user;
    var article_query = 'SELECT * FROM Articles';
    var like_query = 'SELECT * FROM Likes WHERE userId=' + userId;

    connection.query(article_query, function(err,rows,fields) {
        if(err) throw err;
    
        var articles_dict = {};
        for(var ii=0; ii < rows.length; ii++){
            articles_dict[rows[ii].id] = rows[ii];
            articles_dict[rows[ii].id]["userLiked"] = false;
        }

        //now do other query for likes
        connection.query(like_query, function(err,rows,fields) {
            if(err) throw err;
            for(var jj=0; jj < rows.length; jj++){
                articles_dict[rows[jj].articleId]["userLiked"] = true;
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

 app.update("/articles", function(req, res) {
    

 });

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

	
