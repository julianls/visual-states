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
exports.StateMachine = void 0;
var composite_state_1 = require('./composite-state');
var command_container_1 = require('./command-container');
var StateMachine = /** @class */ (function (_super) {
  __extends(StateMachine, _super);
  function StateMachine() {
    var _this = _super.call(this, '') || this;
    _this.commands = new command_container_1.CommandContainer();
    return _this;
  }
  StateMachine.prototype.registerCommand = function (id, command) {
    this.commands.register(id, command);
  };
  StateMachine.prototype.onevent = function (event, data) {
    this.process(event, data, this.commands);
  };
  StateMachine.prototype.executeCommand = function (id, data) {
    return this.commands.execute(id, data);
  };
  return StateMachine;
})(composite_state_1.CompositeState);
exports.StateMachine = StateMachine;
