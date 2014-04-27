var mysql = require('mysql');
var express = require("express");
var app = express();

function db_connect(res) {
  var connection = mysql.createConnection({
    host  : '54.86.82.21', 
    user:'root',
    password:'drippr',
    database:'drippr_db'
  });

  connection.connect(function(err) {
    console.log(err);
  });

  connection.query('SELECT * FROM Articles', function(err,rows,fields) {
    if(err) throw err;
    var obj = {};
    obj['articles'] = rows;
    res.send(obj);
  });

  connection.end();
}

/* testing mysql ajax */
 app.get("/data", function(req, res) {

    db_connect(res);

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
 });

	
