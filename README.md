# Open Decision - JavaScript Interpreter

Open Decision is an Open-Source Decision Automation System, that is optimized for legal processes. The system will be used to build a platform to provide free legal advice for consumers.

**This is the JavaScript Interpreter to display decision trees generated by the Open Decision builder. For the main project, go [here](https://github.com/fbennets/open-decision).**

Further information about the project on www.open-decision.org

##

## Table of content
- [Getting Started](#getting-started)
- [Known Issues](#known-issues)
- [Built with](#built-with)
- [Contributing](#contributing)
- [License](#license)
- [Links](#links)


## Getting Started

Take a look at index.html in the demo folder. You need to to include the interpreter and JSON-logic. If you need compatibility with old browsers, use the non-ES6 version.
```html
<script type="text/javascript" src="logic.js"></script>
<script type="text/javascript" src="../od-js-interpreter-es6.js"></script>
<script type="text/javascript" src="test.json"></script>`
```
The default styling currrently uses bootstrap. Load it by using:
```html
<link rel="stylesheet" type="text/css" href="bootstrap.min.css">
```
Let's use the demo tree for testing. **At the moment, trees exported by the builder must be assigned to a variable. Click [here](#known-issues) for more information.** To do so, simply open the exported .json file with any plain text editor (don't use word :D) and add "tree =" before the rest.
```html
<script type="text/javascript" src="test.json"></script>
```
Now call the init-Function. There are two mandatory arguments, the first one is the variable containing the tree, the second one is the id of the div-container, where the tree will be shown.
```javascript
openDecision.init (tree, "publish-div");
```
You can also use your own styling for most of the UI elements. Just provide a object containing the classes you want to apply. Providing a custom style for an element will override the default styling completely. Don't forget to load your stylesheet in the HTML document.

```javascript
let customStyles = {
   heading: "", // The heading where the tree name is displayed
   inputContainer: "", // A div container containing all input elements
   
   // Input elements
   answerButton: "btn btn-primary ml-2", // The buttons to answer a question
   answerList: "", //The select-list
   numberInput: "", // The number input field 
   dateInput: "", // The date input field
   
   // Free text inputs (the data is saved but no logic is performed)
   freeText: {
     short: "", // A textfield to store user data
     long: "", // A textarea to store user data
     number: "", // A numberfield to store user data
   },
   controls: {
     submitButton: "btn btn-primary ml-2 mt-3", // The button to submit a list, number or date input
     restartButton: "btn btn-primary ml-2 mt-3", // The button to restart the query
     backButton: "btn btn-primary ml-2 mt-3", // The button to go back to the last question
   }
 };
 
openDecision.init (tree, "publish-div", customStyles);

```
You don't need to override all elements, just select the ones you want to modify.
```javascript
openDecision.init (tree, "publish-div", {backButton: "hide-el, restartButton: "btn-warning"});

```


## Known Issues
- Storing trees in a variable: Before you can use a tree exported by the builder, you need to store it in a variable. Simply open the exported .json file with any plain text editor (don't use word :D) and add "tree =" before the rest. It should look like this:
```javascript
tree =  {
  "header": {
    "version": 0.1,
    "build_date": "2020-04-03",
    "tree_name": "Test",
    "tree_slug": "test",
    "start_node": "begruung",
    "vars": {}
  },
  "ausprobieren": {
  
   ...
   
   
   }

```
- No validation: Currently no validation is carried out on the number input field. Will be fixed soon.

## Built with
- JavaScript
- JSONlogic
- Bootstrap

## Contributing

Please read [CONTRIBUTING.md](https://github.com/fbennets/open-decision/blob/master/CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/fbennets/open-decision/blob/master/LICENSE) file for details.

## Links

* [Project Website](http://open-decision.org)
* [Join our Slack-Channel](https://join.slack.com/t/opendecision/shared_invite/enQtNjM2NDUxNTQyNzU4LWYwMzJlZjlhOWJkMmIxMTBmMjYwMDE0Y2Y2OGUyZDBiY2FmOWU4OTVmMDFhMjNhNTIxYWZkZTNkNDRmNjQ4MmM)
* [Documentation](https://open-decision.readthedocs.io/en/latest/)
