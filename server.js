var pg = require('pg');
var express = require("express");
var app = express();
 
var conString = "postgres://postgres:drippr@localhost:5432/drippr";

var client = new pg.Client(conString);

client.connect(function(err) {
  if(err) {
    return console.error('could not connect to postgres', err);
  }
  client.query('SELECT * FROM Articles', function(err, result) {
    if(err) {
      return console.error('error running query', err);
    }
    console.log(result.rows[0]);
    //output: Tue Jan 15 2013 19:12:47 GMT-600 (CST)
    client.end();
  });
});


 /* serves main page */
 app.get("/", function(req, res) {
    res.sendfile(__dirname+'/index.html')
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

	
