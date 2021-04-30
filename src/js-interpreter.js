/*!
 * Open Decision JavaScript Main Interpreter 0.1
 * https://open-decision.org/
 *
 * Copyright Open Legal Tech e.V., Open Decision Project
 * Author Finn Schädlich
 * Released under the MIT license
 * https://github.com/open-decision/open-decision-js-interpreter/blob/master/LICENSE
 *
 * Date: 2021-04-27
 */

import ODCore from "./core.js";

require("./core.js");

("use strict");

  

export default class {
    constructor (json, divId, customCss = {}, allowSave = false) {
        this.renderData = {};
        this.core = ODCore(json, allowSave);
        this.selectedDiv = divId;
        //Set the css styling and overwrite defaults if custom styling was provided
        this.css = {
          ...defaultCss,
          ...customCss,
        };
        //Sets the supportsFileApi for saving the state
        // if (!allowSave){
        //   supportsFileApi = false;
        // } else {
        //   checkFileApi();
        // };
        //Check if provided data is compatible with interpreter version
        checkCompatibility();
        //Start rendering the tree
        displayTree();
      };

       displayTree  () {
        this.preString = `<div class="${css.container.headingContainer}"><h3 class="${css.heading}">${ODCore.tree_name}</h3></div><br>`;
        displayNode();
      };


  displayNode () {
    location.hash = ODCore.currentNode;
    let question = this.renderData.question;


    for(let input of this.renderData.inputs) {
    if (input.type ==='button') {
      for (const [index, option] of input.options.entries()) {
          string += `<button type="button" id="answer-button" class="${css.answerButton}" value="${index}">${option}</button>`
        }
      }
    else if (input.type === 'list') {
      string += `<select id="list-select" class="od-input list-select ${css.answerList}">`;
      for (const [index, option] of input.options.entries()) {
        string += `<option value=${index}>${option}</option>`
        }
        string += '</select>'
      }
    else if (input.type === 'number') {
    string += `<input type="number" id="number-input" class="od-input number-input ${css.numberInput}">`;
  }
  else if (input.type === 'date') {
    string += `<input type="number" id="date-input" class="od-input date-input ${css.dateInput}">`;
  }
  
  else if (input.type === 'free_text') {
    if (input.validation === 'short_text') {
      string += `<label for="${input.id}" >${input.label}<br><input type="text" id="${input.id}" class="free-text short-text od-input ${css.freeText.short}"></label>`;
    } else if (input.validation === 'long_text'){
      string += `<textarea id="${input.id}" class="free-text long-text  od-input ${css.freeText.long}" rows="4" cols="10"></textarea>`;
    } else if (input.validation === 'number'){
    string += `<input type="number" id="${input.id}" class="free-text number od-input ${css.freeText.number}">`;
  }
  }
  };
  if ((this.renderData.inputs.length !== 0)&&(this.renderData.inputs[0].type !== 'button')){
    string += `<br><button type="button" class="${css.controls.submitButton}" id="submit-button">Submit</button>`;
  }
    string += `</div><br><div class="${css.container.controlsContainer}"><button type="button" class="${css.controls.restartButton}" id="restart-button">Restart</button><button type="button" class="${css.controls.backButton}" id="back-button">Back</button>`;
    if (this.supportsFileApi) {
      if (this.ODCore.currentNode === this.ODCore.tree.header.start_node) {
      string += `<input class="${css.controls.saveDataInputField}" accept="application/JSON" type="file" id="files" name="files[]"/></div>`;
      } else {
      string +=  `<button type="button" class=" ${css.controls.saveProgressButton}" id="save-progress-button">Save Progress</button></div>`
      }
    } else {
      string +='</div>'
    };
    document.getElementById(selectedDiv).innerHTML = string;
  
    if (supportsFileApi && (this.ODCore.currentNode === this.ODCore.tree.header.start_node)) {
      document.getElementById(selectedDiv).querySelector('#files').addEventListener('change', loadSaveData, false);
      }
    document.getElementById(selectedDiv).addEventListener( "click", listener );
  };
  

  

};
