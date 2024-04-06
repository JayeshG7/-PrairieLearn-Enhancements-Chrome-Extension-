
function getClassData() {
    console.log('getClassData called!');

    let tableEntries = document.querySelectorAll('tr')
    let entriesArray = Array.from(tableEntries); // Converts NodeList to an array

    /* removes the first element becuase it's always trash that we don't care about */
    entriesArray.shift();

    /* assignment dividers are <tr> entries with only a single <th> element, whereas
    assignment data itself is in the form of <tr> entries with <td> subelements */
    let unprocessedAssignments:string[] = [];
    let assignmentNames = [];

    entriesArray.forEach(entry => {
        let tableData = entry.querySelectorAll('td');
            if (tableData.length > 2) {
                let assignmentData = tableData[1];
                let assignmentName = assignmentData.querySelector('a');
                if (assignmentName != null) {
                    console.log(assignmentName.innerText);
                    assignmentNames.push(assignmentName.innerText);
                } else {
                    console.log(assignmentData.innerText);
                    assignmentNames.push(assignmentData.innerText);
                }
                let dueDate = tableData[2].innerText;
                unprocessedAssignments.push(dueDate);
                console.log(dueDate);
            }
    });

    let processedAssignments = findMostUrgentEntries(unprocessedAssignments);

    //console.log(tableEntries);
}

function findMostUrgentEntries(entries: string[]) {
    // Current time
    const now = new Date();
    // A list of structs containing a number (index) and a Date object
    const assignments: { index: number; date: Date }[] = [];

    // Add all assignments due after today to the list of structs
    for (let i = 0; i < entries.length; i++) {
        const date = parseDate(entries[i]);
        if (date > now) {
            assignments.push({ index: i, date });
        }
    }

    // Sort the list by which assignments have the 'smallest' date and slice to get 5 most recent ones
    const sortedAssignments = assignments.sort((a, b) => a.date.getTime() - b.date.getTime()).slice(0, 5);

    // Return 
    return sortedAssignments;
}

// date is a string in the format '100% until 23:59, Mon, Apr 8'
function parseDate(date: string) {
    const monthToNumber: { [key: string]: number } = {
        Jan: 0,
        Feb: 1,
        Mar: 2,
        Apr: 3,
        May: 4,
        Jun: 5,
        Jul: 6,
        Aug: 7,
        Sep: 8,
        Oct: 9,
        Nov: 10,
        Dec: 11,
        };
    // get the separate components of the due date
    // get rid of commas with replace, then split along spaces
    const parts = date.replace(/,/g, '').split(' ');
    const currentYear = new Date().getFullYear();
    // Convert to format "HH:MM DDD MMM D YYYY" after removing commas
    return new Date(`${currentYear}-${monthToNumber[parts[4]]}-${parts[5]}T0${parts[2]}:00`);
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
