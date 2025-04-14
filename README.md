# PrairieLearn Enhancements

# What is PrairieLearn Enhancements?
PL Enhancements is a Chrome extension that allows the user to display their five most urgent upcoming assignments for each class in the Prairielearn home page with a single button press.
The urgent assignments for each class are displayed under the class name, and include name, due date, current completion percentage, and a link that takes you directly to the assignment when you click on it.

# How do I set it up?

To use the extension from the source code, follow the steps below:

1. Inside of the main/chrome_extension/ directory in the repo, run the command ```npm run build``` This should create a directory inside of the /chrome_extension directory called *dist*

2. After *dist* has been created, open Chrome, and navigate to the url ```chrome://extensions```

3. On the top right corner, activate '**Developer mode**' and then on the top left, click '**Load unpacked**'

4. Navigate to and select the *dist* folder that you created earlier with the npm command. Select that directory as the one to load.

5. Your extension should now be loaded into Chrome. You may now pin it to your searchbar as you would with any other Chrome extension. Clicking on the icon for the extension while on the PrairieLearn home page will run it and display your assignments. 

# Technical Architecture
![Technical Architecture Diagram](./Technical%20Architecture%20for%20PL%20Chrome%20Extension%20(1).png)

# Team

- **Jayesh Ghosh**: Project Lead & Full Stack Developer
  - Spearheaded the project vision and user experience design
  - Managed product roadmap and feature prioritization
  - Led the development team and coordinated cross-functional efforts
  - Designed and implemented the user interface
  - Developed core TypeScript functionality for data extraction and processing
  - Implemented background service worker and content script logic
  - Ensured timely delivery and quality standards

- **Pedro Coelho**: Lead Developer
  - Implemented core TypeScript functionality
  - Developed the extension's data processing logic

- **Bella Cruz**: API Developer
  - Built and maintained project APIs
  - Conducted code reviews and quality assurance

- **Ansh Tomar**: Frontend Developer
  - Assisted with UI implementation
  - Contributed to TypeScript development

# Acknowledgments
Special thanks to the entire team for their dedication and hard work in bringing this project to life. The success of PrairieLearn Enhancements is a testament to the power of collaborative development and user-centric design.


