/**
* Basic chrome extension sample code
*/
chrome.action.onClicked.addListener((tab) => {
    chrome.scripting.executeScript({
        //   func: () => {
        //     const myButton: HTMLButtonElement = document.createElement('button');
        //     myButton.textContent = 'Say hi to Pedro!';
        //     myButton.onclick = () => {
        //       alert('Hey Pedro!')
        //     }
        //     document.body.appendChild(myButton);
        //   },
        //   target: {
        //     tabId: tab.id || 0
        //   }
        // }).then(() => {
        //   console.log('Button inserted');
        // }).catch((err) => {
        //   console.error('Button not inserted', err);
        // });
        func: () => {
            // Get the current DOM and serialize it into a string
            const domContent = new XMLSerializer().serializeToString(document);
            // Paste the string onto the terminal
            console.log(domContent);
        },
        target: {
            tabId: tab.id || 0
        }
    }).then(() => {
        console.log('DOM content logged');
    }).catch((err) => {
        console.error('Failed to log DOM content', err);
    });
});
export {};
