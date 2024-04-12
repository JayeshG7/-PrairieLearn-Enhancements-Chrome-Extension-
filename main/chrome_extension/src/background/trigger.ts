/* ------------------------------------------------------- */
/* ------------------- BACKGROUND SCRIPT ----------------- */
/* ------------------------------------------------------- */
/* This script runs in the background and serves to
perform functions like setting up on-click listeners for the
Chrome extension button, opening and closing tabs, and 
serving as an intermediary to pass messages from one 
content script to the other (receiving and sending) */


/* Sets up an listener that listens for clicks on the Chrome extension button next to the search bar */
chrome.action.onClicked.addListener((tab) => {
  // Ensure there is a valid tab.id before trying to send a message to the content script
    if (tab.id != undefined) {
      console.log("Click has been received!")
      // Send a message to extract URLs. The content script has already been injected in the 
      // webpage through the manifest.json file so no need to inject it again
      chrome.tabs.sendMessage(tab.id, {action: "extractURLs"});
    }
});

/* Sets up a listener to open tabs when receiving an "openTab" message from a content script */
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.action === "openTab") {
    // Creates a tab using Chrome extension API and then performs some actions on it using an arrow function 
    chrome.tabs.create({url: message.url, active: false}, (tab) => {
      if (tab.id != undefined) {
        // Creates a listener on the tab to check the update status (loading, complete, etc...)
        chrome.tabs.onUpdated.addListener(function tabUpdateListener(tabId, changeInfo, updatedTab) {
          // Once the tab is loaded (and content script has been injected), send the "extractData" message
          if (tabId === tab.id && changeInfo.status === 'complete') {
            chrome.tabs.sendMessage(tab.id, {action: "extractData", className: message.url});
            // Remove the update listener as it is no longer needed
            chrome.tabs.onUpdated.removeListener(tabUpdateListener);
          }
        });
      }
    });
  }
});

/* Sets up a listener to resend the "listAssignment" message to the base PrairieLearn page */
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.action === "listAssignment") {
    // Use chrome.tabs.query{} to get tabs that match the  desired URL
    chrome.tabs.query({}, function(tabs) { 
      tabs.forEach(function(tab) {
        // Check if the URL is an exact match
        if (tab.url === 'https://us.prairielearn.com/') {
          if (tab.id !== undefined) {
            // Send the message to the tab
            chrome.tabs.sendMessage(tab.id, message);
          }
        }
      });
    });
  }
});

/* Sets up a listener that closes current tab when receiving the relevant message */
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.action === "closeCurrentTab" && sender.tab && sender.tab.id) {
      // Use chrome.tabs.remove to close the tab
      chrome.tabs.remove(sender.tab.id);
  }
});