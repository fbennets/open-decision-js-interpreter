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

("use strict");

class JSInterpreter{
    constructor (json, divId, customCss = {}, allowSave = false) {
        this.renderData = {};
        this.core = new ODCore(json, allowSave);
        this.selectedDiv = divId;
        this.preString = '';
        this.defaultCss = {
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
        //Set the css styling and overwrite defaults if custom styling was provided
        this.css = {
          ...this.defaultCss,
          ...customCss,
        };
        //Sets the supportsFileApi for saving the state
        // if (!allowSave){
        //   supportsFileApi = false;
        // } else {
        //   checkFileApi();
        // };
        //Check if provided data is compatible with interpreter version
        //Start rendering the tree
      };

       displayTree  () {
        this.renderData = this.core.startInterpretation();
        this.preString = `<div class="${this.css.container.headingContainer}"><h3 class="${this.css.heading}">${this.core.tree.header.tree_name}</h3></div><br>`;
        this.displayNode();
      };


  displayNode () {
    location.hash = this.core.currentNode;
    let question = this.renderData.question;
    let string = `${this.preString}<div class="${this.css.container.questionContainer}"${question}</div><br><div id="od-input-div" class="${this.css.container.inputContainer}">`;

    for(let input of this.renderData.inputs) {
    if (input.type ==='button') {
      for (const [index, option] of input.options.entries()) {
          string += `<button type="button" id="answer-button" class="${this.css.answerButton}" value="${index}">${option}</button>`
        }
      }
    else if (input.type === 'list') {
      string += `<select id="list-select" class="od-input list-select ${this.css.answerList}">`;
      for (const [index, option] of input.options.entries()) {
        string += `<option value=${index}>${option}</option>`
        }
        string += '</select>'
      }
    else if (input.type === 'number') {
    string += `<input type="number" id="number-input" class="od-input number-input ${this.css.numberInput}">`;
  }
  else if (input.type === 'date') {
    string += `<input type="number" id="date-input" class="od-input date-input ${this.css.dateInput}">`;
  }
  
  else if (input.type === 'free_text') {
    if (input.validation === 'short_text') {
      string += `<label for="${input.id}" >${input.label}<br><input type="text" id="${input.id}" class="free-text short-text od-input ${this.css.freeText.short}"></label>`;
    } else if (input.validation === 'long_text'){
      string += `<textarea id="${input.id}" class="free-text long-text  od-input ${this.css.freeText.long}" rows="4" cols="10"></textarea>`;
    } else if (input.validation === 'number'){
    string += `<input type="number" id="${input.id}" class="free-text number od-input ${this.css.freeText.number}">`;
  }
  }
  };
  if ((this.renderData.inputs.length !== 0)&&(this.renderData.inputs[0].type !== 'button')){
    string += `<br><button type="button" class="${this.css.controls.submitButton}" id="submit-button">Submit</button>`;
  }
    string += `</div><br><div class="${this.css.container.controlsContainer}"><button type="button" class="${this.css.controls.restartButton}" id="restart-button">Restart</button><button type="button" class="${this.css.controls.backButton}" id="back-button">Back</button>`;
    if (this.supportsFileApi) {
      if (this.this.core.currentNode === this.core.tree.header.start_node) {
      string += `<input class="${this.css.controls.saveDataInputField}" accept="application/JSON" type="file" id="files" name="files[]"/></div>`;
      } else {
      string +=  `<button type="button" class=" ${this.css.controls.saveProgressButton}" id="save-progress-button">Save Progress</button></div>`
      }
    } else {
      string +='</div>'
    };
    document.getElementById(this.selectedDiv).innerHTML = string;
  
    // if (supportsFileApi && (this.core.currentNode === this.core.tree.header.start_node)) {
    //   document.getElementById(this.selectedDiv).querySelector('#files').addEventListener('change', loadSaveData, false);
    //   }
    document.getElementById(this.selectedDiv).addEventListener( "click", this);
  };
  
  
   listener (event) {
    let target = event.target || event.srcElement;
   
   //Haptic Feedback on mobile devices
  //  if (supportsVibration){
  //    window.navigator.vibrate(50);
  //  }
   
     if (target.id == 'answer-button') {
       let answerId = parseInt(target.value);
       console.log(answerId);
       this.renderData = this.core.interpret(answerId);
       this.displayNode();
   }
     else if (target.id == 'submit-button') {
       let inputs = document.getElementById(this.selectedDiv).querySelector('#od-input-div').querySelectorAll('.od-input');
       let answer = {};

        for (const [index, option] of inputs.entries()){
         if (option.classList.contains('list-select')){
         let inputIndexWithinOptions = parseInt(option.value);
         answer['a'] = this.core.tree[this.core.currentNode].inputs[index].options[inputIndexWithinOptions];
         } else if (option.classList.contains('number-input')){
           answer['a'] = option.value;
         } else if (option.classList.contains('date-input')){
           answer['a'] = option.value;
         } else if (option.classList.contains('free-text')){
             // answer[option.id] = option.value;
           answer['a'] = option.value;
         }};
         this.renderData = this.core.interpret(answer);
         this.displayNode();

     } else if (target.id == 'restart-button') {
      this.renderData = this.core.reset();
      this.displayNode();
   
     } else if (target.id == 'back-button') {
      this.renderData = this.core.goBack();
      this.displayNode();
     } else if (target.id == 'save-progress-button') {

     let saveDataString = JSON.stringify(this.core.getInterpretationState());
     let filename = `${this.core.tree.header.tree_name} - Saved.json`;
     let element = document.createElement('a');
     element.setAttribute('href', 'data:application/JSON;charset=utf-8,' + encodeURIComponent(saveDataString));
     element.setAttribute('download', filename);
     element.style.display = 'none';
     document.body.appendChild(element);
     element.click();
     document.body.removeChild(element);
       }
   };
   handleEvent(event) {
    this.listener(event);
  }
}
export default JSInterpreter;
