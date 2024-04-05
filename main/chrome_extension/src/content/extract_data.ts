
function getClassData() {
    console.log('getClassData called!');

    let tableEntries = document.querySelectorAll('tr')
    let entriesArray = Array.from(tableEntries); // Converts NodeList to an array

    /* removes the first element becuase it's always trash that we don't care about */
    entriesArray.shift();

    /* assignment dividers are <tr> entries with only a single <th> element, whereas
    assignment data itself is in the form of <tr> entries with <td> subelements */

    let assignments: { name: string; deadline: number; }[] = [];

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
                let assignmentName = tableData[0].innerText.trim();
                let dueDateStr = tableData[2].innerText;
                let dueDate = convertDate(dueDateStr);

                console.log(dueDateStr);

                if(dueDate != null) {
                    assignments.push({name: assignmentName, deadline: dueDate});
                }
                
            }
    });

    console.log("Extracted Assignments:", assignments);
    return assignments;
}

function convertDate(deadlineStr: string){
    let parts = deadlineStr.split(',');
    let month = parts[1];
    let day = parseInt(parts[2]);

    let monthIndex = ["Jan" , "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].indexOf(month);

    let deadline = (monthIndex+1)*100 + day;
    return deadline;
}

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if (message.action === "extractData") {
        console.log("extractData message has been received!")
    }
    let assignments = getClassData();
    chrome.runtime.sendMessage({action: "processAssignments", assignments: assignments});
    /* write code to extract data with <tr> here, and then send the processed data back as a mesasge */
    /* once the message is sent, send another message to close the tab */
    /* then write a listener function in start.ts to receive that message and process it */
});
