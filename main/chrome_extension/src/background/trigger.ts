/**
* Basic chrome extension sample code
*/
// chrome.action.onClicked.addListener((tab) => {
//   // Ensure there is a valid tab.id before trying to send a message to the content script
//   if (tab.id !== undefined) {
//       chrome.scripting.executeScript({
//           target: { tabId: tab.id },
//           files: ['src/content/content.js'] // Ensure this path matches where your contentScript.js is located
//       }, () => {
//           // After the content script is injected, send it a message to start extracting URLs
//           if (tab.id != undefined) {
//             chrome.tabs.sendMessage(tab.id, {action: "extractURLs"});
//           }
//       });
//   }
// });

chrome.action.onClicked.addListener((tab) => {
  // Ensure there is a valid tab.id before trying to send a message to the content script
    if (tab.id != undefined) {
      console.log("Click has been received!")
      // Send a message to extract URLs. The content script has already been injected in the 
      // webpage through the manifest.json file so no need to do it again
      chrome.tabs.sendMessage(tab.id, {action: "extractURLs"});
    }
});

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.action === "openTab") {
    chrome.tabs.create({url: message.url, active: true}, (tab) => {
      if (tab.id != undefined) {
        chrome.tabs.onUpdated.addListener(function tabUpdateListener(tabId, changeInfo, updatedTab) {
          if (tabId === tab.id && changeInfo.status === 'complete') {
            chrome.tabs.sendMessage(tab.id, {action: "extractData"});
            chrome.tabs.onUpdated.removeListener(tabUpdateListener);
          }
        });
      }
    });
  }
  if(message.action === "processAssignments") {
    console.log("ProcessAssignmnets message recieved!");
    let closestIndices = findClosesDeadline(message.assignments);
  }
});

function findClosesDeadline(assignments: any[]){
  let currDate = new Date();
  let currm = currDate.getMonth() +1;
  let currD = currDate.getDate();
  let curr = currm * 100 + currD;

  let futureAssignments  = assignments.filter((assignment: { deadline: number; }) => assignment.deadline >= curr);
  futureAssignments.sort((a: { deadline: number; },b: { deadline: number; }) => a.deadline - b.deadline);

  let closest = futureAssignments.slice(0,5).map((assignment: any) => assignments.indexOf(assignment));

  console.log("Closest Deadlines:", closest);
  return closest;

}