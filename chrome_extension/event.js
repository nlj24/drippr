window.onload = function(tab) {


    function getCurTab(funtion) {
        chrome.tabs.query(
            { currentWindow: true, active: true },
            function (tabArray) { funtion(tabArray[0]); }
        );
    }

    function getUrl(tab) {
        var tab_id = tab.id;
        console.log(tab_id);
        chrome.tabs.executeScript(tab_id, { file: "jquery.js" }, function() {

                injectedMethod(tab_id, 'nate', function (response) {
                    var cur_url = response.data;
                    $("#url").append(cur_url);
                });

        });//jquery
    }

    getCurTab(getUrl);


}




// execute the inject.js in a tab and call a method,
// passing the result to a callback function.
function injectedMethod (tab_id, method, callback) {
    console.log(tab_id);
    chrome.tabs.executeScript(tab_id, { file: 'inject.js' }, function(){
    chrome.tabs.sendMessage(tab_id, { method: method }, callback);
    });
}

// Get background-color values from the current tab
// and open them in Colorpeek.
function getBgColors (tab) {
    console.log("hi");
    injectedMethod(tab, 'nate', function (response) {
    alert(response.data);
  })
}


// When the browser action is clicked, call the
// getBgColors function.
chrome.browserAction.onClicked.addListener(getBgColors);




       

