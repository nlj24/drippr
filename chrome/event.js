



// Execute the inject.js in a tab and call a method,
// passing the result to a callback function.
function injectedMethod (tab_id, method, callback) {
  chrome.tabs.executeScript(tab_id, { file: 'inject.js' }, function(){
    chrome.tabs.sendMessage(tab_id, { method: method }, callback);
  });
}


function getCurTab() {
    //query to get the id of new tab
    chrome.tabs.query(
        { currentWindow: true, active: true },
        function (tabArray) { 
            var tab_id = tabArray[0].id;
            // 'the jquery'
            chrome.tabs.executeScript(tab_id, { file: "jquery-2.1.1.min.js" }, function() {
                //retrieve current url
                injectedMethod(tab_id, 'getUrl', function(response) {
                    var dict = response.data;
                    console.log(dict);
                    // var url = dict["url"];
                    // var title = dict["title"];
                    //link to drippr page
                    chrome.tabs.create({ url: 'http://drippr.me/chrome/ext.html' });
                    //query to get the id of new tab
                    chrome.tabs.query(
                        { currentWindow: true, active: true },
                        function (tabArray) { 
                            var new_tab_id = tabArray[0].id;
                            // 'the jquery'
                            chrome.tabs.executeScript(new_tab_id, { file: "jquery-2.1.1.min.js" }, function() {
                                //pass a variable
                                chrome.tabs.executeScript(new_tab_id, {code: 'var config =' + JSON.stringify(dict)}, function() {
                                    //retrieve current url
                                    injectedMethod(new_tab_id, 'insertFields', function(response) {
                                        var url = response.data;
                                    });
                                });
                            });
                        }
                    );
                });
            });
        }
    );       
}





chrome.browserAction.onClicked.addListener(getCurTab);








