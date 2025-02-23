# EcoFinder

## About
EcoFinder is a Chrome Extension powered by OpenAI GPT-4 to help users find eco-friendly alternatives to products with a single click on popular online shopping sites like Amazon, Walmart, Ebay, and Target.

## To run this on your own machine

* Clone this repo
* Run ```npm i``` in the root directory to install the necessary node modules
* Create a  ```.env``` file and add your OPENAI_API_KEY value
* Run ```npm run build``` to generate a ```dist``` folder
* Go to chrome://extensions/ and toggle "Developer Mode" in the top-right
* Select "Load Unpacked" in the top-left and upload the ```dist``` folder
* Turn on the extension by clicking on its bottom-right toggle
* You can now use the extension freely. If you encounter any bugs, please refresh the page and continue. 
