
function getClassData() {
    console.log('getClassData called!');

    let tableEntries = document.querySelectorAll('tr')

    console.log(tableEntries);
    }


chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if (message.action === "extractData") {
        console.log("extractData message has been received!")
    }
    getClassData();
    /* write code to extract data with <tr> here, and then send the processed data back as a mesasge */
    /* once the message is sent, send another message to close the tab */
    /* then write a listener function in start.ts to receive that message and process it */
});
