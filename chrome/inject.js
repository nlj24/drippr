// This helps avoid conflicts in case we inject 
// this script on the same page multiple times
// without reloading.
var injected = injected || (function(){

  // An object that will contain the "methods"
  // we can use from our event script.
  var methods = {};

  methods.getUrl = function(){
    var response = {};
    response["url"] = window.location.href;
    response["title"] = $("title").html();
    var parser = document.createElement('a');
    parser.href = window.location.href;
    response["src"] = parser.hostname;

    return response;

  };



  // This method will eventually return
  // background colors from the current page.
  methods.insertFields = function(){
    $("#link").val(config["url"]);
    $("#title").val(config["title"]);
    $("#src").val(config["src"]);
    console.log("about to define fn");

    $.ajax({
        url: 'https://readability.com/api/content/v1/parser',
        data: {url: $("#link").val(), token: '6bc04a0d9c9c382cb1ea5e8115d4cc5b8ba7a6a7'},
        type:'get',
        success: function(data) {
            console.log(data);
            $("#img").val(data.lead_image_url);
        }   
    });

    return;
    };


// This tells the script to listen for
// messages from our extension.
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    var data = {};
    // If the method the extension has requested
    // exists, call it and assign its response
    // to data.
    if (methods.hasOwnProperty(request.method))
      data = methods[request.method]();
    // Send the response back to our extension.
    sendResponse({ data: data });
    return true;
  });

  return true;
})();