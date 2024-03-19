import puppeteer from 'puppeteer';

function getClassURLs() {
  console.log('getClassURLs called!');
  // Use querySelectorAll to find all <a> tags in the document
  // This is because the links to the classes we are signed up to in PrairieLearn are all stored
  // in this format in the home page
  // https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll
  let aTags = document.querySelectorAll('a');

  // Initialize an array to store the values of these links
  let hrefs: string[] = [];

  // Iterate over the NodeList of <a> tags
  aTags.forEach(aTag => {
    // Extract the href attribute of each <a> tag, if it exists
    // This is where the link is stored
    let href = aTag.getAttribute('href');
    if (href !== null) { // Ensure the href is not null
      if (href.includes("course_instance")) {
        hrefs.push("https://us.prairielearn.com" + href);
      }
    }
  });
  console.log('Extracted hrefs:', hrefs);
  return hrefs; // Return the array of href values
}

async function accessClassURLs(arr: string[]): Promise<string[]> {
  console.log('accessClassURLs called!');
  let data: string[] = [];
    // Launch a headless browser
  const browser = await puppeteer.launch({
    headless: true, // Set to false if you want to see the browser GUI
  });
  //iterate through list of class URLs
  arr.forEach(async href => {
    // Open a new page (tab)
    const page = await browser.newPage();
    // Navigate to a URL
    await page.goto(href);
    // Get all relevant data and print to console
    let assignmentData = document.querySelectorAll('tr');
    // Convert NodeList to an array to use array methods (optional step for convenience)
    let trArray = Array.from(assignmentData);
    // Use map to transform each <tr> element to its innerHTML string,
    // and then join all those strings together to get a single string representation.
    let trString = trArray.map(tr => tr.innerHTML).join('');

    data.push(trString);
  });
  return data;
}
  
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.action === "extractURLs") {
      let hrefs: string[] = [];
      let data: string[] = [];
      hrefs = getClassURLs();
      data = await accessClassURLs(hrefs);
      console.log(data);
  }
});
