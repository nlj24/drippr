$(document).ready(function(){
 
    $.ajax({
        url:'http://localhost:5000/data',
        method:'get',
        success:function(data) {
        	console.log(data);
        }

    });
});