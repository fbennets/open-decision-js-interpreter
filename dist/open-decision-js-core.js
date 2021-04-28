var OpenDecisionJSCore;
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 138:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

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

__webpack_require__(180);

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

/***/ }),

/***/ 180:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/* globals define,module */
/*
Using a Universal Module Loader that should be browser, require, and AMD friendly
http://ricostacruz.com/cheatsheets/umdjs.html
*/
;(function(root, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
		__WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {}
}(this, function() {
  "use strict";
  /* globals console:false */

  if ( ! Array.isArray) {
    Array.isArray = function(arg) {
      return Object.prototype.toString.call(arg) === "[object Array]";
    };
  }

  /**
   * Return an array that contains no duplicates (original not modified)
   * @param  {array} array   Original reference array
   * @return {array}         New array with no duplicates
   */
  function arrayUnique(array) {
    var a = [];
    for (var i=0, l=array.length; i<l; i++) {
      if (a.indexOf(array[i]) === -1) {
        a.push(array[i]);
      }
    }
    return a;
  }

  var jsonLogic = {};
  var operations = {
    "==": function(a, b) {
      return a == b;
    },
    "===": function(a, b) {
      return a === b;
    },
    "!=": function(a, b) {
      return a != b;
    },
    "!==": function(a, b) {
      return a !== b;
    },
    ">": function(a, b) {
      return a > b;
    },
    ">=": function(a, b) {
      return a >= b;
    },
    "<": function(a, b, c) {
      return (c === undefined) ? a < b : (a < b) && (b < c);
    },
    "<=": function(a, b, c) {
      return (c === undefined) ? a <= b : (a <= b) && (b <= c);
    },
    "!!": function(a) {
      return jsonLogic.truthy(a);
    },
    "!": function(a) {
      return !jsonLogic.truthy(a);
    },
    "%": function(a, b) {
      return a % b;
    },
    "log": function(a) {
      console.log(a); return a;
    },
    "in": function(a, b) {
      if (!b || typeof b.indexOf === "undefined") return false;
      return (b.indexOf(a) !== -1);
    },
    "cat": function() {
      return Array.prototype.join.call(arguments, "");
    },
    "substr": function(source, start, end) {
      if (end < 0) {
        // JavaScript doesn't support negative end, this emulates PHP behavior
        var temp = String(source).substr(start);
        return temp.substr(0, temp.length + end);
      }
      return String(source).substr(start, end);
    },
    "+": function() {
      return Array.prototype.reduce.call(arguments, function(a, b) {
        return parseFloat(a, 10) + parseFloat(b, 10);
      }, 0);
    },
    "*": function() {
      return Array.prototype.reduce.call(arguments, function(a, b) {
        return parseFloat(a, 10) * parseFloat(b, 10);
      });
    },
    "-": function(a, b) {
      if (b === undefined) {
        return -a;
      } else {
        return a - b;
      }
    },
    "/": function(a, b) {
      return a / b;
    },
    "min": function() {
      return Math.min.apply(this, arguments);
    },
    "max": function() {
      return Math.max.apply(this, arguments);
    },
    "merge": function() {
      return Array.prototype.reduce.call(arguments, function(a, b) {
        return a.concat(b);
      }, []);
    },
    "var": function(a, b) {
      var not_found = (b === undefined) ? null : b;
      var data = this;
      if (typeof a === "undefined" || a==="" || a===null) {
        return data;
      }
      var sub_props = String(a).split(".");
      for (var i = 0; i < sub_props.length; i++) {
        if (data === null || data === undefined) {
          return not_found;
        }
        // Descending into data
        data = data[sub_props[i]];
        if (data === undefined) {
          return not_found;
        }
      }
      return data;
    },
    "missing": function() {
      /*
      Missing can receive many keys as many arguments, like {"missing:[1,2]}
      Missing can also receive *one* argument that is an array of keys,
      which typically happens if it's actually acting on the output of another command
      (like 'if' or 'merge')
      */

      var missing = [];
      var keys = Array.isArray(arguments[0]) ? arguments[0] : arguments;

      for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        var value = jsonLogic.apply({"var": key}, this);
        if (value === null || value === "") {
          missing.push(key);
        }
      }

      return missing;
    },
    "missing_some": function(need_count, options) {
      // missing_some takes two arguments, how many (minimum) items must be present, and an array of keys (just like 'missing') to check for presence.
      var are_missing = jsonLogic.apply({"missing": options}, this);

      if (options.length - are_missing.length >= need_count) {
        return [];
      } else {
        return are_missing;
      }
    },
  };

  jsonLogic.is_logic = function(logic) {
    return (
      typeof logic === "object" && // An object
      logic !== null && // but not null
      ! Array.isArray(logic) && // and not an array
      Object.keys(logic).length === 1 // with exactly one key
    );
  };

  /*
  This helper will defer to the JsonLogic spec as a tie-breaker when different language interpreters define different behavior for the truthiness of primitives.  E.g., PHP considers empty arrays to be falsy, but Javascript considers them to be truthy. JsonLogic, as an ecosystem, needs one consistent answer.

  Spec and rationale here: http://jsonlogic.com/truthy
  */
  jsonLogic.truthy = function(value) {
    if (Array.isArray(value) && value.length === 0) {
      return false;
    }
    return !! value;
  };


  jsonLogic.get_operator = function(logic) {
    return Object.keys(logic)[0];
  };

  jsonLogic.get_values = function(logic) {
    return logic[jsonLogic.get_operator(logic)];
  };

  jsonLogic.apply = function(logic, data) {
    // Does this array contain logic? Only one way to find out.
    if (Array.isArray(logic)) {
      return logic.map(function(l) {
        return jsonLogic.apply(l, data);
      });
    }
    // You've recursed to a primitive, stop!
    if ( ! jsonLogic.is_logic(logic) ) {
      return logic;
    }

    var op = jsonLogic.get_operator(logic);
    var values = logic[op];
    var i;
    var current;
    var scopedLogic;
    var scopedData;
    var filtered;
    var initial;

    // easy syntax for unary operators, like {"var" : "x"} instead of strict {"var" : ["x"]}
    if ( ! Array.isArray(values)) {
      values = [values];
    }

    // 'if', 'and', and 'or' violate the normal rule of depth-first calculating consequents, let each manage recursion as needed.
    if (op === "if" || op == "?:") {
      /* 'if' should be called with a odd number of parameters, 3 or greater
      This works on the pattern:
      if( 0 ){ 1 }else{ 2 };
      if( 0 ){ 1 }else if( 2 ){ 3 }else{ 4 };
      if( 0 ){ 1 }else if( 2 ){ 3 }else if( 4 ){ 5 }else{ 6 };

      The implementation is:
      For pairs of values (0,1 then 2,3 then 4,5 etc)
      If the first evaluates truthy, evaluate and return the second
      If the first evaluates falsy, jump to the next pair (e.g, 0,1 to 2,3)
      given one parameter, evaluate and return it. (it's an Else and all the If/ElseIf were false)
      given 0 parameters, return NULL (not great practice, but there was no Else)
      */
      for (i = 0; i < values.length - 1; i += 2) {
        if ( jsonLogic.truthy( jsonLogic.apply(values[i], data) ) ) {
          return jsonLogic.apply(values[i+1], data);
        }
      }
      if (values.length === i+1) {
        return jsonLogic.apply(values[i], data);
      }
      return null;
    } else if (op === "and") { // Return first falsy, or last
      for (i=0; i < values.length; i+=1) {
        current = jsonLogic.apply(values[i], data);
        if ( ! jsonLogic.truthy(current)) {
          return current;
        }
      }
      return current; // Last
    } else if (op === "or") {// Return first truthy, or last
      for (i=0; i < values.length; i+=1) {
        current = jsonLogic.apply(values[i], data);
        if ( jsonLogic.truthy(current) ) {
          return current;
        }
      }
      return current; // Last
    } else if (op === "filter") {
      scopedData = jsonLogic.apply(values[0], data);
      scopedLogic = values[1];

      if ( ! Array.isArray(scopedData)) {
        return [];
      }
      // Return only the elements from the array in the first argument,
      // that return truthy when passed to the logic in the second argument.
      // For parity with JavaScript, reindex the returned array
      return scopedData.filter(function(datum) {
        return jsonLogic.truthy( jsonLogic.apply(scopedLogic, datum));
      });
    } else if (op === "map") {
      scopedData = jsonLogic.apply(values[0], data);
      scopedLogic = values[1];

      if ( ! Array.isArray(scopedData)) {
        return [];
      }

      return scopedData.map(function(datum) {
        return jsonLogic.apply(scopedLogic, datum);
      });
    } else if (op === "reduce") {
      scopedData = jsonLogic.apply(values[0], data);
      scopedLogic = values[1];
      initial = typeof values[2] !== "undefined" ? values[2] : null;

      if ( ! Array.isArray(scopedData)) {
        return initial;
      }

      return scopedData.reduce(
        function(accumulator, current) {
          return jsonLogic.apply(
            scopedLogic,
            {current: current, accumulator: accumulator}
          );
        },
        initial
      );
    } else if (op === "all") {
      scopedData = jsonLogic.apply(values[0], data);
      scopedLogic = values[1];
      // All of an empty set is false. Note, some and none have correct fallback after the for loop
      if ( ! scopedData.length) {
        return false;
      }
      for (i=0; i < scopedData.length; i+=1) {
        if ( ! jsonLogic.truthy( jsonLogic.apply(scopedLogic, scopedData[i]) )) {
          return false; // First falsy, short circuit
        }
      }
      return true; // All were truthy
    } else if (op === "none") {
      filtered = jsonLogic.apply({filter: values}, data);
      return filtered.length === 0;
    } else if (op === "some") {
      filtered = jsonLogic.apply({filter: values}, data);
      return filtered.length > 0;
    }

    // Everyone else gets immediate depth-first recursion
    values = values.map(function(val) {
      return jsonLogic.apply(val, data);
    });


    // The operation is called with "data" bound to its "this" and "values" passed as arguments.
    // Structured commands like % or > can name formal arguments while flexible commands (like missing or merge) can operate on the pseudo-array arguments
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/arguments
    if (operations.hasOwnProperty(op) && typeof operations[op] === "function") {
      return operations[op].apply(data, values);
    } else if (op.indexOf(".") > 0) { // Contains a dot, and not in the 0th position
      var sub_ops = String(op).split(".");
      var operation = operations;
      for (i = 0; i < sub_ops.length; i++) {

        if (!operation.hasOwnProperty(sub_ops[i])) {
          throw new Error("Unrecognized operation " + op +
            " (failed at " + sub_ops.slice(0, i+1).join(".") + ")");
        }
        // Descending into operations
        operation = operation[sub_ops[i]];
      }

      return operation.apply(data, values);
    }

    throw new Error("Unrecognized operation " + op );
  };

  jsonLogic.uses_data = function(logic) {
    var collection = [];

    if (jsonLogic.is_logic(logic)) {
      var op = jsonLogic.get_operator(logic);
      var values = logic[op];

      if ( ! Array.isArray(values)) {
        values = [values];
      }

      if (op === "var") {
        // This doesn't cover the case where the arg to var is itself a rule.
        collection.push(values[0]);
      } else {
        // Recursion!
        values.map(function(val) {
          collection.push.apply(collection, jsonLogic.uses_data(val) );
        });
      }
    }

    return arrayUnique(collection);
  };

  jsonLogic.add_operation = function(name, code) {
    operations[name] = code;
  };

  jsonLogic.rm_operation = function(name) {
    delete operations[name];
  };

  jsonLogic.rule_like = function(rule, pattern) {
    // console.log("Is ". JSON.stringify(rule) . " like " . JSON.stringify(pattern) . "?");
    if (pattern === rule) {
      return true;
    } // TODO : Deep object equivalency?
    if (pattern === "@") {
      return true;
    } // Wildcard!
    if (pattern === "number") {
      return (typeof rule === "number");
    }
    if (pattern === "string") {
      return (typeof rule === "string");
    }
    if (pattern === "array") {
      // !logic test might be superfluous in JavaScript
      return Array.isArray(rule) && ! jsonLogic.is_logic(rule);
    }

    if (jsonLogic.is_logic(pattern)) {
      if (jsonLogic.is_logic(rule)) {
        var pattern_op = jsonLogic.get_operator(pattern);
        var rule_op = jsonLogic.get_operator(rule);

        if (pattern_op === "@" || pattern_op === rule_op) {
          // echo "\nOperators match, go deeper\n";
          return jsonLogic.rule_like(
            jsonLogic.get_values(rule, false),
            jsonLogic.get_values(pattern, false)
          );
        }
      }
      return false; // pattern is logic, rule isn't, can't be eq
    }

    if (Array.isArray(pattern)) {
      if (Array.isArray(rule)) {
        if (pattern.length !== rule.length) {
          return false;
        }
        /*
          Note, array order MATTERS, because we're using this array test logic to consider arguments, where order can matter. (e.g., + is commutative, but '-' or 'if' or 'var' are NOT)
        */
        for (var i = 0; i < pattern.length; i += 1) {
          // If any fail, we fail
          if ( ! jsonLogic.rule_like(rule[i], pattern[i])) {
            return false;
          }
        }
        return true; // If they *all* passed, we pass
      } else {
        return false; // Pattern is array, rule isn't
      }
    }

    // Not logic, not array, not a === match for rule.
    return false;
  };

  return jsonLogic;
}));


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(138);
/******/ 	OpenDecisionJSCore = __webpack_exports__;
/******/ 	
/******/ })()
;