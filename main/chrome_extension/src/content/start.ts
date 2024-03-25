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
