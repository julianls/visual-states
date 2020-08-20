'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.Condition = void 0;
var Condition = /** @class */ (function () {
  function Condition(commandName) {
    this.commandName = commandName;
  }
  Condition.prototype.isValid = function (event, data, commands) {
    return commands.execute(this.commandName, data);
  };
  return Condition;
})();
exports.Condition = Condition;
