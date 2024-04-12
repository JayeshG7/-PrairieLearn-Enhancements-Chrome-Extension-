/* --------------------------------------------------------------------- */
/* -------------------- CONTENT SCRIPT (base page) --------------------- */
/* --------------------------------------------------------------------- */
/* This content script is injected into the 'base' PrairieLearn page, the 
one where all of the students' classes are listed. This script contains 
functions that read each class URL, send messages to open class tabs,
and parse through and list assignment data under each class once the data
is received in the form of messages from the other content script */

/* Defines a Dict interface to store data received */
interface Dict {
  [key: string]: string;
}

/* Gets URLs for each class from the base page */
function getClassURLs() {
  // console.log('getClassURLs called!');
  // The links to the classes we are signed up to in PrairieLearn are all stored
  // in this format in the base page
  let aTags = document.querySelectorAll('a');

  let hrefs: string[] = [];

  // Iterate over the NodeList of <a> tags
  aTags.forEach(aTag => {
    // Extract the href attribute of each <a> tag, if it exists. This is where the URLs are.
    let href = aTag.getAttribute('href');
    if (href !== null) { // Ensure the href is not null and points to a course instance
      if (href.includes("course_instance")) {
        hrefs.push("https://us.prairielearn.com" + href);
      }
    }
  });
  //console.log('Extracted hrefs:', hrefs);
  return hrefs; 
}

/* Displays assignments on the base page. The function places them as bullet points
using an unordered list ('ul') element containing list item ('li') elements */
function showAssignments(assignment_class: string, text: string, urls_list: any[]) {
  /* Get table where assignments are going to be displayed */
  let table = document.querySelector('tbody');
  /* Create an element to store the assignment data before inserting it into the table */
  let element = document.createElement('tr');
  /* The assignments are newline-separated within the text.*/
  let assignments = text.split('\n');
  /* The last one is empty, so we can get rid of it */
  assignments.pop();
  let list = document.createElement('ul');
  /* The counter variable will be used to index into our list of urls. This will be used to 
  add urls to the assignments using 'a' elements with 'href' attributes  */
  let counter = 0;
  assignments.forEach(assignment => {
    let bulletPoint = document.createElement('li');
    let bulletPointText = document.createElement('a');
    /* sets URL pointing to the assignment as well as inner text */
    bulletPointText.setAttribute('href', urls_list[counter]);
    bulletPointText.textContent = assignment;
    /* appends the text to the bullet point, and the bullet point to the unordered list */
    bulletPoint.appendChild(bulletPointText);
    list.appendChild(bulletPoint);
    counter += 1;
  });
  /* The 'ul' element must be inserted as a child of a table division ('td') element, and the 'td'
  then inserted as an element of the tbody we appended */
  let td = document.createElement('td');
  td.appendChild(list);
  element.appendChild(td);

  // The control flow below will insert the element we just created into the proper location
  if (table != null) {
    let entries = table.querySelectorAll('tr');
    //console.log(entries);
    entries.forEach(entry => {
      let td = entry.querySelector('td');
      //console.log(td);
      if (td != null) {
        let a = entry.querySelector('a');
        //console.log(a);
        if (a != null) {
          // If the URL of the table entry corresponding to the class is equal to the attribute that 
          // we received in the message, we have foundn the location in the table where we need to insert
          // the data
          if (('https://us.prairielearn.com' + a.getAttribute('href')) == assignment_class) {
            entry.parentNode?.insertBefore(element, entry.nextSibling);
          }
        }
      }
    });
  }
}

/* This dictionary will be set up in the following format: the keys represent
the unique URL of a particular class, and the value is a string containing several 
newline-separated lines that encompass the assignment data for the class to be 
displayed in the page. */
/* This dictionary will be assembled by the "listAssignment" message listener,
and then the particular key-value pair corresponding to each class is used as 
an argument for the showAssignments function. */
let dict: Dict = {};

/* Sets up a listener to extract URLs  */
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.action === "extractURLs") {
      console.log("extractURLs message has been received!")
      let hrefs: string[] = [];
      hrefs = getClassURLs();
      hrefs.forEach(href => {
        if (href) {
          chrome.runtime.sendMessage({action: "openTab", url: href});
        }
      })
  }
});

/* Sets up a listener to show assigments */
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.action === "listAssignment") {
    //console.log("listAssignment message has been received!");
    //console.log(message.class, message.names, message.due_dates);
    for (let i = 0; i < (message.names).length; i++) {
      let assignment_name = message.names[i];
      let assignment_due_date = message.due_dates[i];
      /* Sets up the dictionary entry associated with that particular class*/
        if (dict[message.class] == undefined) {
          dict[message.class] = `${assignment_name} - ${assignment_due_date}\n`;
        } else {
          dict[message.class] += `${assignment_name} - ${assignment_due_date}\n`;
        }
    }
    /* Calls showAssignments function for the class that was just added. */
    showAssignments(message.class, dict[message.class], message.urls);
  }
});
