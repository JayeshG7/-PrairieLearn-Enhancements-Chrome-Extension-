
// function getClassData() {
//     console.log('getClassData called!');

//     let tableEntries = document.querySelectorAll('tr')

//     console.log(tableEntries);
//     }


chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if (message.action === "extractData") {
        console.log("extractData message has been received!")
    }
});
