/**
* Basic chrome extension sample code
*/
chrome.action.onClicked.addListener((tab) => {
    chrome.scripting.executeScript({
    func: () => {
      // Get the current DOM and serialize it into a string
      const domContent = new XMLSerializer().serializeToString(document);
      // Paste the string onto the terminal
      // console.log(domContent);
      // Send the data to where it needs to go
      chrome.runtime.sendMessage({domContent: domContent})
    },
    target: {
      tabId: tab.id || 0
    }
  }).then(() => {
    console.log('DOM content logged');
  }).catch((err) => {
    console.error('Failed to log DOM content', err);
  });
})

chrome.runtime.onMessage.addListener(
  (message, sender, sendResponse) => {
    if (message.domContent) {
      // Perform processing on the DOM content that was received
      console.log('DOM content received!');
      getClassURLs(message.domContent);
    }
  }
);

function getClassURLs(domContent: string): string[] {
  console.log('getClassURLs called!');
  // Define a new instance of DOMParser, a JS library for parsing DOM content (like BeautifulSoup)
  // https://developer.mozilla.org/en-US/docs/Web/API/DOMParser
  let parser = new DOMParser();
  
  // The domContent is a string, but to be able to use some of the DOMParser functions we want
  // like querySelector, we need to call parseFromString to turn it into a doc
  let doc = parser.parseFromString(domContent, 'text/html');
  
  // Use querySelectorAll to find all <a> tags in the document
  // This is because the links to the classes we are signed up to in PrairieLearn are all stored
  // in this format in the home page
  // https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll
  let aTags = doc.querySelectorAll('a');

  // Initialize an array to store the values of these links
  let hrefs: string[] = [];

  // Iterate over the NodeList of <a> tags
  aTags.forEach(aTag => {
    // Extract the href attribute of each <a> tag, if it exists
    // This is where the link is stored
    let href = aTag.getAttribute('href');
    if (href !== null) { // Ensure the href is not null
      hrefs.push("https://us.prairielearn.com/" + href);
    }
  });

  console.log('Extracted hrefs:', hrefs);
  return hrefs; // Return the array of href values
}
