'use strict';
var __extends =
  (this && this.__extends) ||
  (function () {
    var extendStatics = function (d, b) {
      extendStatics =
        Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array &&
          function (d, b) {
            d.__proto__ = b;
          }) ||
        function (d, b) {
          for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        };
      return extendStatics(d, b);
    };
    return function (d, b) {
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype = b === null ? Object.create(b) : ((__.prototype = b.prototype), new __());
    };
  })();
Object.defineProperty(exports, '__esModule', { value: true });
exports.CompositeState = void 0;
var simple_state_1 = require('./simple-state');
var transition_1 = require('./transition');
var action_1 = require('./action');
var condition_1 = require('./condition');
var CompositeState = /** @class */ (function (_super) {
  __extends(CompositeState, _super);
  function CompositeState(name) {
    var _this = _super.call(this, name) || this;
    _this.states = [];
    _this.transitions = [];
    return _this;
  }
  CompositeState.prototype.process = function (event, data, commands) {
    var subActiveState = this.activeState.process(event, data, commands);
    for (var _i = 0, _a = this.transitions; _i < _a.length; _i++) {
      var transition = _a[_i];
      if (transition.sourceState === this.activeState && transition.isValid(event, data, commands)) {
        this.setState(transition.execute(this, data, commands), commands);
        break;
      }
    }
    if (subActiveState && subActiveState.isExit) this.setState(this.states[1], commands);
    return this.activeState;
  };
  CompositeState.prototype.onEnter = function (commands) {
    // console.log("EnterState::" + this.name);
    if (this.entryState && this.activeState !== this.entryState) this.setState(this.entryState, commands);
    for (var _i = 0, _a = this.entryActions; _i < _a.length; _i++) {
      var action = _a[_i];
      action.execute(null, commands);
    }
  };
  CompositeState.prototype.onExit = function (commands) {
    // console.log("ExitState::" + this.name);
    for (var _i = 0, _a = this.exitActions; _i < _a.length; _i++) {
      var action = _a[_i];
      action.execute(null, commands);
    }
  };
  CompositeState.prototype.setState = function (state, commands) {
    if (commands === void 0) {
      commands = null;
    }
    if (this.activeState) this.activeState.onExit(commands);
    this.activeState = state;
    this.activeState.onEnter(commands);
  };
  CompositeState.prototype.addState = function (name) {
    var state = new simple_state_1.SimpleState(name);
    this.states.push(state);
    return state;
  };
  CompositeState.prototype.addEntryState = function () {
    var state = this.addState('entry');
    this.entryState = state;
    return state;
  };
  CompositeState.prototype.addExitState = function (name) {
    if (name === void 0) {
      name = 'exit';
    }
    var state = this.addState(name);
    state.isExit = true;
    return state;
  };
  CompositeState.prototype.addCompositeState = function (name) {
    var state = new CompositeState(name);
    this.states.push(state);
    return state;
  };
  CompositeState.prototype.addTransition = function (event, sourceState, targetState, actionCommand, conditionCommand) {
    if (actionCommand === void 0) {
      actionCommand = '';
    }
    if (conditionCommand === void 0) {
      conditionCommand = '';
    }
    var transition = new transition_1.Transition(event);
    transition.sourceState = this.findState(sourceState);
    transition.targetState = this.findState(targetState);
    if (actionCommand) transition.actions.push(new action_1.Action(actionCommand));
    if (conditionCommand) transition.condition = new condition_1.Condition(conditionCommand);
    this.transitions.push(transition);
    return transition;
  };
  CompositeState.prototype.findState = function (name) {
    for (var _i = 0, _a = this.states; _i < _a.length; _i++) {
      var state = _a[_i];
      if (state.name === name) return state;
    }
    return null;
  };
  return CompositeState;
})(simple_state_1.SimpleState);
exports.CompositeState = CompositeState;
