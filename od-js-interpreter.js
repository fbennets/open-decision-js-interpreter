"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/*!
 * Open Decision JavaScript Interpreter v0.1.1
 * https://open-decision.org/
 *
 * Copyright Finn Schädlich, Open Decision Project
 * Released under the MIT license
 * https://github.com/fbennets/open-decision/blob/master/LICENSE
 *
 * Date: 2020-05-03
 */
window.openDecision = function () {
  "use strict"; // The node of the tree the user is currently seeing

  var currentNode,
      // The decision tree that is being rendered
  tree,
      // Contains the html to display the tree name
  preString,
      // Used to log the nodes shown and answers given by the user, used for history
  log,
      // The div-container in which the tree is rendered in (where the question, buttons etc. is shown)
  selectedDiv,
      // Boolean to determine if the device can vibrate
  supportsVibration,
      // Boolean to determine if HTML5 file API is available
  supportsFileApi,
      // Object  to expose the internal functions
  expose = {},
      //CSS for UI elements
  css = {}; //version of  the Interpreter

  var COMPATIBLE_VERSIONS = [0.1],
      //default CSS for UI elements
  defaultCss = {
    container: {
      headingContainer: "",
      questionContainer: "",
      inputContainer: "",
      controlsContainer: ""
    },
    heading: "",
    answerButton: "btn btn-primary ml-2",
    answerList: "",
    numberInput: "",
    dateInput: "",
    freeText: {
      short: "",
      long: "",
      number: ""
    },
    controls: {
      submitButton: "btn btn-primary ml-2 mt-3",
      restartButton: "btn btn-primary ml-2 mt-3",
      backButton: "btn btn-primary ml-2 mt-3",
      saveProgressButton: "btn btn-primary ml-2 mt-3",
      saveDataInputField: ""
    }
  };

  expose.init = function (path, divId) {
    var customCss = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var allowSave = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    tree = path;
    selectedDiv = divId; //Set the css styling and overwrite defaults if custom styling was provided

    css = { ...defaultCss,
      ...customCss
    };
    log = {
      'nodes': [],
      'answers': {}
    }; //Sets the supportsVibration for mobile devices

    deviceCanVibrate(); //Sets the supportsFileApi for saving the state

    if (!allowSave) {
      supportsFileApi = false;
    } else {
      checkFileApi();
    }

    ; //Check if provided data is compatible with interpreter version

    checkCompatibility(); //Start rendering the tree

    displayTree();
  }; // Listener for hashchange in the URL if the user clicks the browser's back-button


  window.onhashchange = function () {
    if (currentNode != location.hash.replace('#', '') && location.hash.length > 0) {
      if (log.nodes.length > 0) {
        //Go back one step
        currentNode = location.hash.replace('#', '');
        log.nodes.pop();
        delete log.answers[currentNode];
      } else {
        // Else restart
        currentNode = tree.header.start_node;
        log = {
          'nodes': [],
          'answers': {}
        };
      }

      displayNode();
    }
  };

  function displayTree() {
    currentNode = tree.header.start_node;
    preString = "<div class=\"".concat(css.container.headingContainer, "\"><h3 class=\"").concat(css.heading, "\">").concat(tree.header.tree_name, "</h3></div><br>");
    displayNode();
  }

  ;

  function displayNode() {
    location.hash = currentNode;
    var question = tree[currentNode].text; //Replace in-text variables

    question = replaceVars(question, log.answers);
    var string = "".concat(preString, "<div class=\"").concat(css.container.questionContainer, "\"").concat(question, "</div><br><div id=\"od-input-div\" class=\"").concat(css.container.inputContainer, "\">");
    var inputCounter = {
      'buttonsCount': 0,
      'listCount': 0,
      'numberCount': 0,
      'dateCount': 0,
      'freeTextCount': 0
    };

    for (var j = 0; j < tree[currentNode].inputs.length; j++) {
      if (tree[currentNode].inputs[j].type === 'button') {
        for (var i = 0; i < tree[currentNode].inputs[j].options.length; i++) {
          string += "<button type=\"button\" id=\"answer-button\" class=\"".concat(css.answerButton, "\" data-index=\"").concat(j, "\" value=\"").concat(i, "\">").concat(tree[currentNode].inputs[j].options[i], "</button>");
        }

        inputCounter['buttonsCount'] = +1;
      } else if (tree[currentNode].inputs[j].type === 'list') {
        string += "<select id=\"list-select\" class=\"od-input list-select ".concat(css.answerList, "\" data-index=\"").concat(j, "\">");

        for (var _i = 0; _i < tree[currentNode].inputs[j].options.length; _i++) {
          string += "<option value=".concat(_i, ">").concat(tree[currentNode].inputs[j].options[_i], "</option>");
        }

        string += '</select>';
        inputCounter['listCount'] = +1;
      } else if (tree[currentNode].inputs[j].type === 'number') {
        string += "<input type=\"number\" id=\"number-input\" class=\"od-input number-input ".concat(css.numberInput, "\" data-index=\"").concat(j, "\">");
        inputCounter['numberCount'] = +1;
      } else if (tree[currentNode].inputs[j].type === 'date') {
        string += "<input type=\"number\" id=\"date-input\" class=\"od-input date-input ".concat(css.dateInput, "\" data-index=\"").concat(j, "\">");
        inputCounter['dateCount'] = +1;
      } else if (tree[currentNode].inputs[j].type === 'free_text') {
        if (tree[currentNode].inputs[j].validation === 'short_text') {
          string += "<label for=\"".concat(tree[currentNode].inputs[j].id, "\" >").concat(tree[currentNode].inputs[j].label, "<br><input type=\"text\" id=\"").concat(tree[currentNode].inputs[j].id, "\" class=\"free-text short-text od-input ").concat(css.freeText.short, "\" data-index=\"").concat(j, "\"></label>");
        } else if (tree[currentNode].inputs[j].validation === 'long_text') {
          string += "<textarea id=\"".concat(tree[currentNode].inputs[j].id, "\" class=\"free-text long-text  od-input ").concat(css.freeText.long, "\" data-index=\"").concat(j, "\" rows=\"4\" cols=\"10\"></textarea>");
        } else if (tree[currentNode].inputs[j].validation === 'number') {
          string += "<input type=\"number\" id=\"".concat(tree[currentNode].inputs[j].id, "\" class=\"free-text number od-input ").concat(css.freeText.number, "\" data-index=\"").concat(j, "\">");
        }

        inputCounter['freeTextCount'] = +1;
      }
    }

    ;

    if (tree[currentNode].inputs.length !== 0 && tree[currentNode].inputs[0].type !== 'button') {
      string += "<br><button type=\"button\" class=\"".concat(css.controls.submitButton, "\" id=\"submit-button\">Submit</button>");
    }

    string += "</div><br><div class=\"".concat(css.container.controlsContainer, "\"><button type=\"button\" class=\"").concat(css.controls.restartButton, "\" id=\"restart-button\">Restart</button><button type=\"button\" class=\"").concat(css.controls.backButton, "\" id=\"back-button\">Back</button>");

    if (supportsFileApi) {
      if (currentNode === tree.header.start_node) {
        string += "<input class=\"".concat(css.controls.saveDataInputField, "\" accept=\"application/JSON\" type=\"file\" id=\"files\" name=\"files[]\"/></div>");
      } else {
        string += "<button type=\"button\" class=\" ".concat(css.controls.saveProgressButton, "\" id=\"save-progress-button\">Save Progress</button></div>");
      }
    } else {
      string += '</div>';
    }

    ;
    document.getElementById(selectedDiv).innerHTML = string;

    if (supportsFileApi && currentNode === tree.header.start_node) {
      document.getElementById(selectedDiv).querySelector('#files').addEventListener('change', loadSaveData, false);
    }

    document.getElementById(selectedDiv).addEventListener("click", listener);
  }

  ;

  function listener(event) {
    var target = event.target || event.srcElement; //Haptic Feedback on mobile devices

    if (supportsVibration) {
      window.navigator.vibrate(50);
    }

    if (target.id == 'answer-button') {
      var answerId = parseInt(target.value);
      checkAnswer(answerId, 'button');
    } else if (target.id == 'submit-button') {
      var inputs = document.getElementById(selectedDiv).querySelector('#od-input-div').querySelectorAll('.od-input');
      var answer = {};
      inputs.forEach(function (i) {
        if (i.classList.contains('list-select')) {
          var inputIndex = parseInt(i.getAttribute("data-index"));
          answer['a'] = tree[currentNode].inputs[inputIndex].options[parseInt(i.value)];
        } else if (i.classList.contains('number-input')) {
          answer['a'] = i.value;
        } else if (i.classList.contains('date-input')) {
          answer['a'] = i.value;
        } else if (i.classList.contains('free-text')) {
          // answer[i.id] = i.value;
          answer['a'] = i.value;
        }
      });
      checkAnswer(answer);
    } else if (target.id == 'restart-button') {
      currentNode = tree.header.start_node;
      log = {
        'nodes': [],
        'answers': {}
      };
      displayNode();
    } else if (target.id == 'back-button') {
      if (log.nodes.length > 0) {
        delete log.answers[currentNode];
        currentNode = log.nodes.pop();
      } else {
        currentNode = tree.header.start_node;
        log = {
          'nodes': [],
          'answers': {}
        };
      }

      displayNode();
    } else if (target.id == 'save-progress-button') {
      // Save log and current node
      var saveData = {
        header: { ...tree.header
        },
        log: { ...log
        },
        currentNode: currentNode
      };
      var saveDataString = JSON.stringify(saveData);
      var filename = "".concat(tree.header.tree_name, " - Saved.json");
      var element = document.createElement('a');
      element.setAttribute('href', 'data:application/JSON;charset=utf-8,' + encodeURIComponent(saveDataString));
      element.setAttribute('download', filename);
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  }

  ;

  function checkAnswer(answer, inputType) {
    log['nodes'].push(currentNode);
    log['answers'][currentNode] = answer;

    if (Object.keys(tree[currentNode].rules).length === 0) {
      if ('default' in tree[currentNode].destination) {
        // If only free text
        currentNode = tree[currentNode].destination['default'];
      } else {
        // If only buttons
        currentNode = tree[currentNode].destination[answer];
      }
    } else {
      // If we have rules
      var rule = jsonLogic.apply(tree[currentNode].rules, answer);
      currentNode = tree[currentNode].destination[rule];
    }

    displayNode();
  }

  ; //Helper functions
  //Checks if device supports Vibration

  function deviceCanVibrate() {
    try {
      window.navigator.vibrate(1);
      supportsVibration = true;
    } catch (e) {
      supportsVibration = false;
    }
  }

  ; // Check for the various File API support.

  function checkFileApi() {
    if (window.File && window.FileReader) {
      supportsFileApi = true;
    } else {
      supportsFileApi = false;
    }
  }

  ; //Checks if loaded data is  compatible with interpreter version

  function checkCompatibility() {
    var compatible = false;

    for (var i = 0; i < COMPATIBLE_VERSIONS.length; i++) {
      if (COMPATIBLE_VERSIONS[i] === tree.header.version) {
        compatible = true;
      }
    }

    if (!compatible) {
      document.getElementById(selectedDiv).innerHTML = "The provided file uses the Open Decision dataformat version ".concat(tree.header.version, ". This library only supports ").concat(COMPATIBLE_VERSIONS, ".");
      throw {
        name: "IncompatibleVersion",
        message: "The provided file uses the Open Decision dataformat version ".concat(tree.header.version, ". This library only supports ").concat(COMPATIBLE_VERSIONS, "."),
        toString: function toString() {
          return this.name + ": " + this.message;
        }
      };
    }
  }

  ; //Load the JSON file storing the progress

  function loadSaveData(evt) {
    var f = evt.target.files[0];

    if (f.type === 'application/json') {
      var reader = new FileReader();

      reader.onload = function (theFile) {
        return function (e) {
          var savedData = JSON.parse(e.target.result);

          if (savedData.header.tree_slug === tree.header.tree_slug) {
            currentNode = savedData.currentNode;
            log = savedData.log;
            displayNode();
          } else {
            alert('Please load the correct save data.');
          }
        };
      }(f); // Read in the JSON


      reader.readAsText(f);
    }
  }

  ; //Replace vars

  function replaceVars(string, varsLocation) {
    //Match double square brackets
    var regExp = /\[\[([^\]]+)]]/g;
    var match = regExp.exec(string);

    while (match != null) {
      var answer = void 0;
      match[1] = match[1].trim();
      var period = match[1].indexOf('.');

      if (period !== -1) {
        var node = match[1].substring(0, period);
        var id = match[1].substring(period + 1);
        answer = node in varsLocation ? varsLocation[node][id] : "MISSING";
      } else {
        answer = match[1] in varsLocation ? varsLocation[match[1]] : "MISSING";
      }

      if (typeof answer === 'number') {
        try {
          var answerText = tree[match[1]].inputs[0].options[answer];

          if (answerText !== undefined) {
            answer = answerText;
          }
        } catch {}
      } else if (_typeof(answer) === 'object') {
        try {
          answer = varsLocation[match[1]].a;
        } catch {}
      }

      ;
      string = string.replace(match[0], answer);
      match = regExp.exec(string);
    }

    return string;
  }

  ; // To do:
  // Validate user input and give errors
  // JS translation

  return expose;
}();