/* --------------------------------------------------------------------- */
/* ------------------ CONTENT SCRIPT (class pages) --------------------- */
/* --------------------------------------------------------------------- */
/* This content script is injected into pages corresponding to 
each class the student is signed up for once these pages have been loaded.
This script performs functions such as reading assignment data, parsing it,
and then resending it to the main page where it can be displayed */


/* Extracts data for each class, sending data wrapped in a "listAssignments" message */
function getClassData(class_name: string) {
    /* function logging */
    // console.log('getClassData called!'); 
    // console.log(class_name);

    /* Selects HTML elements that contain assignment data from the page's DOM */
    let table_entries = document.querySelectorAll('tr')
    /* Converts NodeList to an array, allowing us to perform convenient array methods */
    let entries = Array.from(table_entries); 

    /* Removes the first element becuase it's always trash */
    entries.shift();

    /* Sets up arrays that contain relevant assignment data. These will later be passed
    to the base page content script through a message */
    let due_dates: string[] = [];
    let names: string[] = [];
    let urls: string[] = [];
    
    /* The table entries containing the assignment data itself are <tr> entries with <td> subelements, whereas
    irrelevant table entries do not follow this pattern.  */
    /* This pattern is what we will use to filter out relevant entries. */
    entries.forEach(entry => {
        let data = entry.querySelectorAll('td');
            /* ensure the assignment contains enough data to extract what we need */
            if (data.length > 2) {
                let name_with_url = (data[1]).querySelector('a');
                let due_date = data[2].innerText;
                /* perform validation checks */
                if (name_with_url != null && name_with_url != undefined && due_date != 'None ' && due_date != 'Assessment closed. ') {
                    let url = name_with_url.getAttribute('href');
                    let name = name_with_url.innerText;
                    /* perform a further validation check */
                    if (url != null) { 
                        urls.push(url); 
                        due_dates.push(due_date);
                        names.push(name);
                    }
                    /* function logging */
                    // console.log(name);
                    // console.log(due_date);
                    // console.log(url);
                }
            }
    });

    /* Gets most urgent entries (returns their due dates and indices) */
    let most_urgent_entries = findMostUrgentEntries(due_dates);

    let top_names: any[] = [];
    let top_due_dates: any[] = [];
    let top_urls: any[] = [];

    /* Uses the indices to recover the names, due dates, and URLs of each assignment */
    most_urgent_entries.forEach(entry => {
        top_names.push(names[entry.index]);
        top_due_dates.push(due_dates[entry.index]);
        top_urls.push(urls[entry.index]);
    });
    
    // console.log("Sending listAssignment message!");
    chrome.runtime.sendMessage({action: "listAssignment", 
                                class: class_name, 
                                names: top_names, 
                                due_dates: top_due_dates,
                                urls: top_urls});
}

/* Finds most urgent entries from based on their due date*/
function findMostUrgentEntries(entries: string[]) {
    // Current time
    const now = new Date();
    // A list of structs, each containing a number (represents the index) and a Date object
    const assignments: { index: number; date: Date }[] = [];

    for (let i = 0; i < entries.length; i++) {
        /* Parse the due date into the correct format for sorting */
        const date = parseDate(entries[i]);
        /* Function logging */
        //console.log(entries[i]);
        //console.log(date);
        if (date > now) {
            // Add all assignments due after today to the list of structs
            assignments.push({ index: i, date });
        }
    }

    // Sort the list by which assignments have the 'smallest' date and slice to get 5 most recent ones
    const sortedAssignments = assignments.sort((a, b) => a.date.getTime() - b.date.getTime()).slice(0, 5);

    return sortedAssignments;
}

// The date is a string in the format '100% until 23:59, Mon, Apr 8'
// This function takes such a string and returns one in the format "HH:MM DDD MMM D YYYY"
function parseDate(date: string) {
    /* dictionary used for month translation*/
    const month_name_to_number: { [key: string]: string } = {
        Jan: '01',
        Feb: '02',
        Mar: '03',
        Apr: '04',
        May: '05',
        Jun: '06',
        Jul: '07',
        Aug: '08',
        Sep: '09',
        Oct: '10',
        Nov: '11',
        Dec: '12'
    };
    // get a list of the separate components of the due date
    // get rid of commas with replace, then split along spaces
    const parts = date.replace(/,/g, '').split(' ');
    // if the day consists of a single digit, append a 0 to the beginning
    if (parts[5].length == 1) {
        parts[5] = "0" + parts[5];
    }
    // get current year as assignment due date (might not always be accurate! but uh no other way to get it)
    const currentYear = new Date().getFullYear();
    /* function logging */
    // console.log(`${currentYear}-${month_name_to_number[parts[4]]}-${parts[5]}T${parts[2]}:00`);
    // Convert to format "HH:MM DDD MMM D YYYY" after removing commas, and return
    return new Date(`${currentYear}-${month_name_to_number[parts[4]]}-${parts[5]}T${parts[2]}:00`);
}

/* Sets up listener to extract data and close current tab once extraction is complete */
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if (message.action === "extractData") {
        console.log("extractData message has been received!")
    }
    getClassData(message.className);
    chrome.runtime.sendMessage({action: "closeCurrentTab"});
});
