(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("OpenDecisionJSInterpreter", [], factory);
	else if(typeof exports === 'object')
		exports["OpenDecisionJSInterpreter"] = factory();
	else
		root["OpenDecisionJSInterpreter"] = factory();
})(this, function() {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 761:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.default = void 0;

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

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
__webpack_require__(590);

"use strict";

var ODCore = /*#__PURE__*/function () {
  function ODCore(json) {
    var allowSave = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    _classCallCheck(this, ODCore);

    this.tree = json;
    this.currentNode = this.tree.header.start_node;
    this.log = {
      nodes: [],
      answers: {}
    };
    this.supportsFileApi = false;
    this.COMPATIBLE_VERSIONS = [0.1];
  }

  _createClass(ODCore, [{
    key: "startRendering",
    value: function startRendering() {
      this.currentNode = this.tree.header.start_node;
      return this.renderNode();
    }
  }, {
    key: "renderNode",
    value: function renderNode() {
      //Set render data and replace in-text variables
      var renderData = {
        question: this.replaceVars(this.tree[this.currentNode].text, this.log.answers),
        inputs: this.tree[this.currentNode].inputs
      };
      return JSON.stringify(renderData);
    }
  }, {
    key: "checkAnswer",
    value: function checkAnswer(answer) {
      this.log["nodes"].push(this.currentNode);
      this.log["answers"][this.currentNode] = answer;

      if (Object.keys(this.tree[this.currentNode].rules).length === 0) {
        if ("default" in this.tree[this.currentNode].destination) {
          // If only free text
          this.currentNode = this.tree[this.currentNode].destination["default"];
        } else {
          // If only buttons
          this.currentNode = this.tree[this.currentNode].destination[answer];
        }
      } else {
        // If we have rules
        var rule = jsonLogic.apply(this.tree[this.currentNode].rules, answer);
        this.currentNode = this.tree[this.currentNode].destination[rule];
      }

      this.renderNode();
    } //Helper functions

  }, {
    key: "appName",
    get: function get() {
      return this.tree.header.tree_name;
    }
  }, {
    key: "goBack",
    value: function goBack() {
      if (this.log.nodes.length > 0) {
        delete this.log.answers[this.currentNode];
        this.currentNode = this.log.nodes.pop();
      } else {
        this.currentNode = this.tree.header.start_node;
        this.log = {
          nodes: [],
          answers: {}
        };
      }

      this.renderNode();
    }
  }, {
    key: "restart",
    value: function restart() {
      this.currentNode = this.tree.header.start_node;
      this.log = {
        nodes: [],
        answers: {}
      };
      this.renderNode();
    }
  }, {
    key: "getCurrentState",
    value: function getCurrentState() {
      // Save log and current node
      var stateData = {
        header: _objectSpread({}, this.tree.header),
        log: _objectSpread({}, this.log),
        currentNode: this.currentNode
      };
      return JSON.stringify(stateData);
    } //Load the JSON file storing the progress

  }, {
    key: "loadSavedState",
    value: function loadSavedState(savedState) {
      var savedData = JSON.parse(savedState);

      if (savedData.header.tree_slug === this.tree.header.tree_slug) {
        this.currentNode = savedData.currentNode;
        this.log = savedData.log;
        this.renderNode();
      } else {
        alert("Please load the correct save data.");
      }
    } //Checks if loaded data is  compatible with interpreter version

  }, {
    key: "checkCompatibility",
    value: function checkCompatibility() {
      var compatible = false;

      for (var i = 0; i < COMPATIBLE_VERSIONS.length; i++) {
        if (COMPATIBLE_VERSIONS[i] === this.tree.header.version) {
          compatible = true;
        }
      }

      if (!compatible) {
        throw {
          name: "IncompatibleVersion",
          message: "The provided file uses the Open Decision dataformat version ".concat(this.tree.header.version, ". This library only supports ").concat(COMPATIBLE_VERSIONS, "."),
          toString: function toString() {
            return this.name + ": " + this.message;
          }
        };
      }
    } //Replace vars

  }, {
    key: "replaceVars",
    value: function replaceVars(string, varsLocation) {
      //Match double square brackets
      var regExp = /\[\[([^\]]+)]]/g;
      var match = regExp.exec(string);

      while (match != null) {
        var answer = void 0;
        match[1] = match[1].trim();
        var period = match[1].indexOf(".");

        if (period !== -1) {
          var node = match[1].substring(0, period);
          var id = match[1].substring(period + 1);
          answer = node in varsLocation ? varsLocation[node][id] : "MISSING";
        } else {
          answer = match[1] in varsLocation ? varsLocation[match[1]] : "MISSING";
        }

        if (typeof answer === "number") {
          try {
            var answerText = tree[match[1]].inputs[0].options[answer];

            if (answerText !== undefined) {
              answer = answerText;
            }
          } catch (_unused) {}
        } else if (_typeof(answer) === "object") {
          try {
            answer = varsLocation[match[1]].a;
          } catch (_unused2) {}
        }

        string = string.replace(match[0], answer);
        match = regExp.exec(string);
      }

      return string;
    } // To do:
    // Validate user input and give errors
    // JS translation

  }]);

  return ODCore;
}();

;
var _default = ODCore;
exports.default = _default;

/***/ }),

/***/ 590:
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/* globals define,module */

/*
Using a Universal Module Loader that should be browser, require, and AMD friendly
http://ricostacruz.com/cheatsheets/umdjs.html
*/
;

(function (root, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
		__WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {}
})(void 0, function () {
  "use strict";
  /* globals console:false */

  if (!Array.isArray) {
    Array.isArray = function (arg) {
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

    for (var i = 0, l = array.length; i < l; i++) {
      if (a.indexOf(array[i]) === -1) {
        a.push(array[i]);
      }
    }

    return a;
  }

  var jsonLogic = {};
  var operations = {
    "==": function _(a, b) {
      return a == b;
    },
    "===": function _(a, b) {
      return a === b;
    },
    "!=": function _(a, b) {
      return a != b;
    },
    "!==": function _(a, b) {
      return a !== b;
    },
    ">": function _(a, b) {
      return a > b;
    },
    ">=": function _(a, b) {
      return a >= b;
    },
    "<": function _(a, b, c) {
      return c === undefined ? a < b : a < b && b < c;
    },
    "<=": function _(a, b, c) {
      return c === undefined ? a <= b : a <= b && b <= c;
    },
    "!!": function _(a) {
      return jsonLogic.truthy(a);
    },
    "!": function _(a) {
      return !jsonLogic.truthy(a);
    },
    "%": function _(a, b) {
      return a % b;
    },
    "log": function log(a) {
      console.log(a);
      return a;
    },
    "in": function _in(a, b) {
      if (!b || typeof b.indexOf === "undefined") return false;
      return b.indexOf(a) !== -1;
    },
    "cat": function cat() {
      return Array.prototype.join.call(arguments, "");
    },
    "substr": function substr(source, start, end) {
      if (end < 0) {
        // JavaScript doesn't support negative end, this emulates PHP behavior
        var temp = String(source).substr(start);
        return temp.substr(0, temp.length + end);
      }

      return String(source).substr(start, end);
    },
    "+": function _() {
      return Array.prototype.reduce.call(arguments, function (a, b) {
        return parseFloat(a, 10) + parseFloat(b, 10);
      }, 0);
    },
    "*": function _() {
      return Array.prototype.reduce.call(arguments, function (a, b) {
        return parseFloat(a, 10) * parseFloat(b, 10);
      });
    },
    "-": function _(a, b) {
      if (b === undefined) {
        return -a;
      } else {
        return a - b;
      }
    },
    "/": function _(a, b) {
      return a / b;
    },
    "min": function min() {
      return Math.min.apply(this, arguments);
    },
    "max": function max() {
      return Math.max.apply(this, arguments);
    },
    "merge": function merge() {
      return Array.prototype.reduce.call(arguments, function (a, b) {
        return a.concat(b);
      }, []);
    },
    "var": function _var(a, b) {
      var not_found = b === undefined ? null : b;
      var data = this;

      if (typeof a === "undefined" || a === "" || a === null) {
        return data;
      }

      var sub_props = String(a).split(".");

      for (var i = 0; i < sub_props.length; i++) {
        if (data === null || data === undefined) {
          return not_found;
        } // Descending into data


        data = data[sub_props[i]];

        if (data === undefined) {
          return not_found;
        }
      }

      return data;
    },
    "missing": function missing() {
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
        var value = jsonLogic.apply({
          "var": key
        }, this);

        if (value === null || value === "") {
          missing.push(key);
        }
      }

      return missing;
    },
    "missing_some": function missing_some(need_count, options) {
      // missing_some takes two arguments, how many (minimum) items must be present, and an array of keys (just like 'missing') to check for presence.
      var are_missing = jsonLogic.apply({
        "missing": options
      }, this);

      if (options.length - are_missing.length >= need_count) {
        return [];
      } else {
        return are_missing;
      }
    }
  };

  jsonLogic.is_logic = function (logic) {
    return _typeof(logic) === "object" && // An object
    logic !== null && // but not null
    !Array.isArray(logic) && // and not an array
    Object.keys(logic).length === 1 // with exactly one key
    ;
  };
  /*
  This helper will defer to the JsonLogic spec as a tie-breaker when different language interpreters define different behavior for the truthiness of primitives.  E.g., PHP considers empty arrays to be falsy, but Javascript considers them to be truthy. JsonLogic, as an ecosystem, needs one consistent answer.
   Spec and rationale here: http://jsonlogic.com/truthy
  */


  jsonLogic.truthy = function (value) {
    if (Array.isArray(value) && value.length === 0) {
      return false;
    }

    return !!value;
  };

  jsonLogic.get_operator = function (logic) {
    return Object.keys(logic)[0];
  };

  jsonLogic.get_values = function (logic) {
    return logic[jsonLogic.get_operator(logic)];
  };

  jsonLogic.apply = function (logic, data) {
    // Does this array contain logic? Only one way to find out.
    if (Array.isArray(logic)) {
      return logic.map(function (l) {
        return jsonLogic.apply(l, data);
      });
    } // You've recursed to a primitive, stop!


    if (!jsonLogic.is_logic(logic)) {
      return logic;
    }

    var op = jsonLogic.get_operator(logic);
    var values = logic[op];
    var i;
    var current;
    var scopedLogic;
    var scopedData;
    var filtered;
    var initial; // easy syntax for unary operators, like {"var" : "x"} instead of strict {"var" : ["x"]}

    if (!Array.isArray(values)) {
      values = [values];
    } // 'if', 'and', and 'or' violate the normal rule of depth-first calculating consequents, let each manage recursion as needed.


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
        if (jsonLogic.truthy(jsonLogic.apply(values[i], data))) {
          return jsonLogic.apply(values[i + 1], data);
        }
      }

      if (values.length === i + 1) {
        return jsonLogic.apply(values[i], data);
      }

      return null;
    } else if (op === "and") {
      // Return first falsy, or last
      for (i = 0; i < values.length; i += 1) {
        current = jsonLogic.apply(values[i], data);

        if (!jsonLogic.truthy(current)) {
          return current;
        }
      }

      return current; // Last
    } else if (op === "or") {
      // Return first truthy, or last
      for (i = 0; i < values.length; i += 1) {
        current = jsonLogic.apply(values[i], data);

        if (jsonLogic.truthy(current)) {
          return current;
        }
      }

      return current; // Last
    } else if (op === "filter") {
      scopedData = jsonLogic.apply(values[0], data);
      scopedLogic = values[1];

      if (!Array.isArray(scopedData)) {
        return [];
      } // Return only the elements from the array in the first argument,
      // that return truthy when passed to the logic in the second argument.
      // For parity with JavaScript, reindex the returned array


      return scopedData.filter(function (datum) {
        return jsonLogic.truthy(jsonLogic.apply(scopedLogic, datum));
      });
    } else if (op === "map") {
      scopedData = jsonLogic.apply(values[0], data);
      scopedLogic = values[1];

      if (!Array.isArray(scopedData)) {
        return [];
      }

      return scopedData.map(function (datum) {
        return jsonLogic.apply(scopedLogic, datum);
      });
    } else if (op === "reduce") {
      scopedData = jsonLogic.apply(values[0], data);
      scopedLogic = values[1];
      initial = typeof values[2] !== "undefined" ? values[2] : null;

      if (!Array.isArray(scopedData)) {
        return initial;
      }

      return scopedData.reduce(function (accumulator, current) {
        return jsonLogic.apply(scopedLogic, {
          current: current,
          accumulator: accumulator
        });
      }, initial);
    } else if (op === "all") {
      scopedData = jsonLogic.apply(values[0], data);
      scopedLogic = values[1]; // All of an empty set is false. Note, some and none have correct fallback after the for loop

      if (!scopedData.length) {
        return false;
      }

      for (i = 0; i < scopedData.length; i += 1) {
        if (!jsonLogic.truthy(jsonLogic.apply(scopedLogic, scopedData[i]))) {
          return false; // First falsy, short circuit
        }
      }

      return true; // All were truthy
    } else if (op === "none") {
      filtered = jsonLogic.apply({
        filter: values
      }, data);
      return filtered.length === 0;
    } else if (op === "some") {
      filtered = jsonLogic.apply({
        filter: values
      }, data);
      return filtered.length > 0;
    } // Everyone else gets immediate depth-first recursion


    values = values.map(function (val) {
      return jsonLogic.apply(val, data);
    }); // The operation is called with "data" bound to its "this" and "values" passed as arguments.
    // Structured commands like % or > can name formal arguments while flexible commands (like missing or merge) can operate on the pseudo-array arguments
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/arguments

    if (operations.hasOwnProperty(op) && typeof operations[op] === "function") {
      return operations[op].apply(data, values);
    } else if (op.indexOf(".") > 0) {
      // Contains a dot, and not in the 0th position
      var sub_ops = String(op).split(".");
      var operation = operations;

      for (i = 0; i < sub_ops.length; i++) {
        if (!operation.hasOwnProperty(sub_ops[i])) {
          throw new Error("Unrecognized operation " + op + " (failed at " + sub_ops.slice(0, i + 1).join(".") + ")");
        } // Descending into operations


        operation = operation[sub_ops[i]];
      }

      return operation.apply(data, values);
    }

    throw new Error("Unrecognized operation " + op);
  };

  jsonLogic.uses_data = function (logic) {
    var collection = [];

    if (jsonLogic.is_logic(logic)) {
      var op = jsonLogic.get_operator(logic);
      var values = logic[op];

      if (!Array.isArray(values)) {
        values = [values];
      }

      if (op === "var") {
        // This doesn't cover the case where the arg to var is itself a rule.
        collection.push(values[0]);
      } else {
        // Recursion!
        values.map(function (val) {
          collection.push.apply(collection, jsonLogic.uses_data(val));
        });
      }
    }

    return arrayUnique(collection);
  };

  jsonLogic.add_operation = function (name, code) {
    operations[name] = code;
  };

  jsonLogic.rm_operation = function (name) {
    delete operations[name];
  };

  jsonLogic.rule_like = function (rule, pattern) {
    // console.log("Is ". JSON.stringify(rule) . " like " . JSON.stringify(pattern) . "?");
    if (pattern === rule) {
      return true;
    } // TODO : Deep object equivalency?


    if (pattern === "@") {
      return true;
    } // Wildcard!


    if (pattern === "number") {
      return typeof rule === "number";
    }

    if (pattern === "string") {
      return typeof rule === "string";
    }

    if (pattern === "array") {
      // !logic test might be superfluous in JavaScript
      return Array.isArray(rule) && !jsonLogic.is_logic(rule);
    }

    if (jsonLogic.is_logic(pattern)) {
      if (jsonLogic.is_logic(rule)) {
        var pattern_op = jsonLogic.get_operator(pattern);
        var rule_op = jsonLogic.get_operator(rule);

        if (pattern_op === "@" || pattern_op === rule_op) {
          // echo "\nOperators match, go deeper\n";
          return jsonLogic.rule_like(jsonLogic.get_values(rule, false), jsonLogic.get_values(pattern, false));
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
          if (!jsonLogic.rule_like(rule[i], pattern[i])) {
            return false;
          }
        }

        return true; // If they *all* passed, we pass
      } else {
        return false; // Pattern is array, rule isn't
      }
    } // Not logic, not array, not a === match for rule.


    return false;
  };

  return jsonLogic;
});

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
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
var __webpack_unused_export__;


__webpack_unused_export__ = ({
  value: true
});
exports.default = void 0;

var _core = _interopRequireDefault(__webpack_require__(761));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { var _i = arr && (typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]); if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

__webpack_require__(761);

"use strict";

var _default = /*#__PURE__*/function () {
  function _default(json, divId) {
    var customCss = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var allowSave = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

    _classCallCheck(this, _default);

    this.renderData = {};
    this.core = (0, _core["default"])(json, allowSave);
    this.selectedDiv = divId; //Set the css styling and overwrite defaults if custom styling was provided

    this.css = _objectSpread(_objectSpread({}, defaultCss), customCss); //Sets the supportsFileApi for saving the state
    // if (!allowSave){
    //   supportsFileApi = false;
    // } else {
    //   checkFileApi();
    // };
    //Check if provided data is compatible with interpreter version

    checkCompatibility(); //Start rendering the tree

    displayTree();
  }

  _createClass(_default, [{
    key: "displayTree",
    value: function displayTree() {
      this.preString = "<div class=\"".concat(css.container.headingContainer, "\"><h3 class=\"").concat(css.heading, "\">").concat(_core["default"].tree_name, "</h3></div><br>");
      displayNode();
    }
  }, {
    key: "displayNode",
    value: function displayNode() {
      location.hash = _core["default"].currentNode;
      var question = this.renderData.question;

      var _iterator = _createForOfIteratorHelper(this.renderData.inputs),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var input = _step.value;

          if (input.type === 'button') {
            var _iterator2 = _createForOfIteratorHelper(input.options.entries()),
                _step2;

            try {
              for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                var _step2$value = _slicedToArray(_step2.value, 2),
                    index = _step2$value[0],
                    option = _step2$value[1];

                string += "<button type=\"button\" id=\"answer-button\" class=\"".concat(css.answerButton, "\" value=\"").concat(index, "\">").concat(option, "</button>");
              }
            } catch (err) {
              _iterator2.e(err);
            } finally {
              _iterator2.f();
            }
          } else if (input.type === 'list') {
            string += "<select id=\"list-select\" class=\"od-input list-select ".concat(css.answerList, "\">");

            var _iterator3 = _createForOfIteratorHelper(input.options.entries()),
                _step3;

            try {
              for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
                var _step3$value = _slicedToArray(_step3.value, 2),
                    _index = _step3$value[0],
                    _option = _step3$value[1];

                string += "<option value=".concat(_index, ">").concat(_option, "</option>");
              }
            } catch (err) {
              _iterator3.e(err);
            } finally {
              _iterator3.f();
            }

            string += '</select>';
          } else if (input.type === 'number') {
            string += "<input type=\"number\" id=\"number-input\" class=\"od-input number-input ".concat(css.numberInput, "\">");
          } else if (input.type === 'date') {
            string += "<input type=\"number\" id=\"date-input\" class=\"od-input date-input ".concat(css.dateInput, "\">");
          } else if (input.type === 'free_text') {
            if (input.validation === 'short_text') {
              string += "<label for=\"".concat(input.id, "\" >").concat(input.label, "<br><input type=\"text\" id=\"").concat(input.id, "\" class=\"free-text short-text od-input ").concat(css.freeText["short"], "\"></label>");
            } else if (input.validation === 'long_text') {
              string += "<textarea id=\"".concat(input.id, "\" class=\"free-text long-text  od-input ").concat(css.freeText["long"], "\" rows=\"4\" cols=\"10\"></textarea>");
            } else if (input.validation === 'number') {
              string += "<input type=\"number\" id=\"".concat(input.id, "\" class=\"free-text number od-input ").concat(css.freeText.number, "\">");
            }
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      ;

      if (this.renderData.inputs.length !== 0 && this.renderData.inputs[0].type !== 'button') {
        string += "<br><button type=\"button\" class=\"".concat(css.controls.submitButton, "\" id=\"submit-button\">Submit</button>");
      }

      string += "</div><br><div class=\"".concat(css.container.controlsContainer, "\"><button type=\"button\" class=\"").concat(css.controls.restartButton, "\" id=\"restart-button\">Restart</button><button type=\"button\" class=\"").concat(css.controls.backButton, "\" id=\"back-button\">Back</button>");

      if (this.supportsFileApi) {
        if (this.ODCore.currentNode === this.ODCore.tree.header.start_node) {
          string += "<input class=\"".concat(css.controls.saveDataInputField, "\" accept=\"application/JSON\" type=\"file\" id=\"files\" name=\"files[]\"/></div>");
        } else {
          string += "<button type=\"button\" class=\" ".concat(css.controls.saveProgressButton, "\" id=\"save-progress-button\">Save Progress</button></div>");
        }
      } else {
        string += '</div>';
      }

      ;
      document.getElementById(selectedDiv).innerHTML = string;

      if (supportsFileApi && this.ODCore.currentNode === this.ODCore.tree.header.start_node) {
        document.getElementById(selectedDiv).querySelector('#files').addEventListener('change', loadSaveData, false);
      }

      document.getElementById(selectedDiv).addEventListener("click", listener);
    }
  }]);

  return _default;
}();

exports.default = _default;
;
})();

__webpack_exports__ = __webpack_exports__.default;
/******/ 	return __webpack_exports__;
/******/ })()
;
});