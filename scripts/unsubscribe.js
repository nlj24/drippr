console.log("hello");

function getParameterByName( name,href ){
    name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
    var regexS = "[\\?&]"+name+"=([^&#]*)";
    var regex = new RegExp( regexS );
    var results = regex.exec( href );
    if( results == null )
        return "";
    else
        return decodeURIComponent(results[1].replace(/\+/g, " "));
}

var user_id = getParameterByName("id", window.location.href);

$.ajax({
    url: 'http://drippr.me/unsubscribe',
    data: {user_id: user_id},
    dataType: 'json',
    method:'get',
    success: function() {
        return;
    }
});