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
exports.SimpleState = void 0;
var state_1 = require('./state');
var SimpleState = /** @class */ (function (_super) {
  __extends(SimpleState, _super);
  function SimpleState(name, isExit) {
    if (isExit === void 0) {
      isExit = false;
    }
    var _this = _super.call(this, name) || this;
    _this.isExit = isExit;
    return _this;
  }
  SimpleState.prototype.process = function (event, data, commands) {
    return this;
  };
  SimpleState.prototype.onEnter = function (commands) {
    // console.log("EnterState::" + this.name);
    for (var _i = 0, _a = this.entryActions; _i < _a.length; _i++) {
      var action = _a[_i];
      action.execute(null, commands);
    }
  };
  SimpleState.prototype.onExit = function (commands) {
    // console.log("ExitState::" + this.name);
    for (var _i = 0, _a = this.exitActions; _i < _a.length; _i++) {
      var action = _a[_i];
      action.execute(null, commands);
    }
  };
  return SimpleState;
})(state_1.State);
exports.SimpleState = SimpleState;
