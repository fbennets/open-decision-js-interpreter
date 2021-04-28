/*!
 * Open Decision JavaScript Core Interpreter 0.1
 * https://open-decision.org/
 *
 * Copyright Open Legal Tech e.V., Open Decision Project
 * Author Finn Schädlich
 * Released under the MIT license
 * https://github.com/open-decision/open-decision-js-interpreter/blob/master/LICENSE
 *
 * Date: 2021-04-27
 */

require("./logic.js");

("use strict");
class Render{

  // The decision tree that is being rendered
  #tree;
  // The node of the tree the user is currently seeing
  #currentNode;
  // Used to log the nodes shown and answers given by the user, used for history
  #log;
  // Boolean to determine if a file API is available
  #supportsFileApi;
   //version of  the Interprete
  static COMPATIBLE_VERSIONS = [0.1];

  constructor(json, allowSave = false) {
    this.#tree = JSON.parse(json);
    this.#currentNode = this.#tree.header.start_node;
    this.#log = { nodes: [], answers: {} };
    this.#supportsFileApi = false
  }

  startRendering() {
    this.#currentNode = this.#tree.header.start_node;
    return this.#renderNode();
  }

  #renderNode() {
    //Set render data and replace in-text variables
    let renderData = {
      appName: this.#tree.header.tree_name,
      question: this.replaceVars(this.#tree[this.#currentNode].text, this.#log.answers),
      inputs: this.#tree[this.#currentNode].inputs,
    };
    let string = JSON.stringify(renderData);
    return string;
  }

  checkAnswer(answer, inputType) {
    this.#log["nodes"].push(this.#currentNode);
    this.#log["answers"][this.#currentNode] = answer;

    if (Object.keys(this.#tree[this.#currentNode].rules).length === 0) {
      if ("default" in this.#tree[this.#currentNode].destination) {
        // If only free text
        this.#currentNode = this.#tree[this.#currentNode].destination["default"];
      } else {
        // If only buttons
        this.#currentNode = this.#tree[this.#currentNode].destination[answer];
      }
    } else {
      // If we have rules
      let rule = jsonLogic.apply(this.#tree[this.#currentNode].rules, answer);
      this.#currentNode = this.#tree[this.#currentNode].destination[rule];
    }
    this.#renderNode();
  }

  //Helper functions

  goBack() {
    if (this.#log.nodes.length > 0) {
      delete this.#log.answers[this.#currentNode];
      this.#currentNode = this.#log.nodes.pop();
    } else {
      this.#currentNode = this.#tree.header.start_node;
      this.#log = { nodes: [], answers: {} };
    }
    this.#renderNode();
  }

  restart() {
    this.#currentNode = this.#tree.header.start_node;
    this.#log = { nodes: [], answers: {} };
    this.#renderNode();
  }

  getCurrentState() {
    // Save log and current node
    let stateData = {
      header: { ...this.#tree.header },
      log: { ...this.#log },
      currentNode: this.#currentNode,
    };
    return JSON.stringify(stateData);
  }

  //Load the JSON file storing the progress
  loadSavedState(savedState) {
    let savedData = JSON.parse(savedState);
    if (savedData.header.tree_slug === this.#tree.header.tree_slug) {
      this.#currentNode = savedData.currentNode;
      this.#log = savedData.log;
      this.#renderNode();
    } else {
      alert("Please load the correct save data.");
    }
  }

  //Checks if loaded data is  compatible with interpreter version
  checkCompatibility() {
    let compatible = false;
    for (var i = 0; i < COMPATIBLE_VERSIONS.length; i++) {
      if (COMPATIBLE_VERSIONS[i] === this.#tree.header.version) {
        compatible = true;
      }
    }
    if (!compatible) {
      throw {
        name: "IncompatibleVersion",
        message: `The provided file uses the Open Decision dataformat version ${this.#tree.header.version}. This library only supports ${COMPATIBLE_VERSIONS}.`,
        toString: function () {
          return this.name + ": " + this.message;
        },
      };
    }
  }

  //Replace vars
  replaceVars(string, varsLocation) {
    //Match double square brackets
    let regExp = /\[\[([^\]]+)]]/g;
    let match = regExp.exec(string);

    while (match != null) {
      let answer;
      match[1] = match[1].trim();
      let period = match[1].indexOf(".");
      if (period !== -1) {
        let node = match[1].substring(0, period);
        let id = match[1].substring(period + 1);
        answer = node in varsLocation ? varsLocation[node][id] : "MISSING";
      } else {
        answer = match[1] in varsLocation ? varsLocation[match[1]] : "MISSING";
      }

      if (typeof answer === "number") {
        try {
          let answerText = tree[match[1]].inputs[0].options[answer];
          if (answerText !== undefined) {
            answer = answerText;
          }
        } catch {}
      } else if (typeof answer === "object") {
        try {
          answer = varsLocation[match[1]].a;
        } catch {}
      }
      string = string.replace(match[0], answer);
      match = regExp.exec(string);
    }
    return string;
  }
  // To do:
  // Validate user input and give errors
  // JS translation
}
module.exports = Render;