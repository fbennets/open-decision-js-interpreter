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

import * as jsonLogic from "json-logic-js";

/**
 * @returns {string} a nodeId.
 */
const getNextNodeId = (node, answer) => {
  // If there is a default destination we can directly go there. There cannot be any rules, because they would
  // have no pourpose!
  if ("default" in node.destination) return node.destination["default"];

  //---------------------------------------------------------------------------
  // Depreceate!
  // This handles an edge case for button answer types, that we want to remove
  if (Object.keys(node.rules).length === 0) {
    return node.destination[answer];
  }
  //---------------------------------------------------------------------------

  // If there is no default destination we expect rules to be present. The application of these rules determines
  // the next node.
  const logicResult = jsonLogic.apply(node.rules, answer);
  return node.destination[logicResult];
};

export class ODCore {
  tree: any;
  currentNode: string;
  history: { nodes: string[]; answers: Record<string, string> };
  state: "initialized" | "idle" | "started" | "interpreting";
  COMPATIBLE_VERSIONS: number[];

  constructor(json, allowSave = false) {
    /**
     * Represents the entire decision tree.
     */
    this.tree = json;
    /**
     * The state of the currently active node for this instance of the interpretation.
     */
    this.currentNode = this.tree.header.start_node;
    /**
     * The log of visited nodes and given answers.
     */
    this.history = { nodes: [], answers: {} };
    /**
     * Represents the current state of the interpretation.
     */
    this.state = "initialized";
    // this.supportsFileApi = false;
    this.COMPATIBLE_VERSIONS = [0.1];
  }

  /**
   * First function to be called to start the interpretation.
   */
  startInterpretation() {
    this.state = "started";
    return this.getCurrentNode();
  }

  /**
   * Used to receive the necessary data to render the `currentNode`.
   * @returns JSON String of the `currentNodes` `renderData`
   */
  getCurrentNode() {
    //Set render data and replace in-text variables
    let renderData = {
      question: this.replaceVars(
        this.tree[this.currentNode].text,
        this.history.answers
      ),
      inputs: this.tree[this.currentNode].inputs,
    };
    return renderData;
  }

  /**
   * Interprets the answer received from the user to determine the next node.
   */
  evaluateUserInput(answer) {
    this.state = "interpreting";

    this.history["nodes"].push(this.currentNode);
    this.history["answers"][this.currentNode] = answer;

    this.currentNode = getNextNodeId(this.tree[this.currentNode], answer);

    this.state = "idle";

    this.getCurrentNode();
  }

  //Helper functions

  get treeName() {
    return this.tree.header.tree_name;
  }

  /**
   * Allows to revert the last selection.
   */
  goBack() {
    if (this.history.nodes.length > 0) {
      delete this.history.answers[this.currentNode];
      this.currentNode = this.history.nodes.pop();
    } else {
      this.currentNode = this.tree.header.start_node;
      this.history = { nodes: [], answers: {} };
    }
    this.getCurrentNode();
  }

  /**
   * Restart the Interpretation.
   */
  reset() {
    this.currentNode = this.tree.header.start_node;
    this.history = { nodes: [], answers: {} };
    this.getCurrentNode();
  }

  getInterpretationState() {
    // Save log and current node
    let stateData = {
      header: { ...this.tree.header },
      log: { ...this.history },
      currentNode: this.currentNode,
    };
    return JSON.stringify(stateData);
  }

  //Load the JSON file storing the progress
  setInterpretationState(savedState) {
    let savedData = JSON.parse(savedState);
    if (savedData.header.tree_slug === this.tree.header.tree_slug) {
      this.currentNode = savedData.currentNode;
      this.history = savedData.log;
      this.getCurrentNode();
    } else {
      alert("Please load the correct save data.");
    }
  }

  //Checks if loaded data is  compatible with interpreter version
  checkCompatibility() {
    let compatible = false;
    for (var i = 0; i < this.COMPATIBLE_VERSIONS.length; i++) {
      if (this.COMPATIBLE_VERSIONS[i] === this.tree.header.version) {
        compatible = true;
      }
    }
    if (!compatible) {
      throw {
        name: "IncompatibleVersion",
        message: `The provided file uses the Open Decision dataformat version ${this.tree.header.version}. This library only supports ${this.COMPATIBLE_VERSIONS}.`,
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
          let answerText = this.tree[match[1]].inputs[0].options[answer];
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
