
function getClassData() {
    console.log('getClassData called!');

    let tableEntries = document.querySelectorAll('tr')
    let entriesArray = Array.from(tableEntries); // Converts NodeList to an array

    /* removes the first element becuase it's always trash that we don't care about */
    entriesArray.shift();

    /* assignment dividers are <tr> entries with only a single <th> element, whereas
    assignment data itself is in the form of <tr> entries with <td> subelements */

    entriesArray.forEach(entry => {
        // let tableHeader = entry.querySelector('th');
        // if (tableHeader == null) {
        //     let tableData = entry.querySelectorAll('td');
        //     if (tableData.length > 2) {
        //         let dueDate = tableData[2].innerText;
        //         console.log(dueDate);
        //     }
        // }
        let tableData = entry.querySelectorAll('td');
            if (tableData.length > 2) {
                let assignmentData = tableData[1];
                let assignmentName = assignmentData.querySelectorAll('a');
                let nameEntriesArray = Array.from(assignmentName);
                console.log(nameEntriesArray[0].innerText);
                let dueDate = tableData[2].innerText;
                console.log(dueDate);
            }
    });

    //console.log(tableEntries);
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
