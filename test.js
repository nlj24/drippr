var express = require("express");
var app = express();
 
 
 /* serves all the static files */
 app.get('/', function(req, res){ 
     console.log('static file request : ' + req.params);
     res.sendfile(__dirname + "/test.html"); 
 });

 app.get(/^(.+)$/, function(req, res){ 
    res.sendfile( __dirname + req.params[0]); 
});

 app.post('/postTest', function(req, res){
	req.setEncoding('utf8');
    var body;
    req.on('data', function(chunk) {
        body = chunk;
        console.log(body);
    });
 	res.send("hey");
 });
 
 var port = process.env.PORT || 5003;
 
 app.listen(port, function() {
   console.log("Listening on " + port);
 });

	
