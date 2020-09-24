'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.Action = void 0;
var Action = /** @class */ (function () {
  function Action(commandName) {
    this.commandName = commandName;
  }
  Action.prototype.execute = function (data, commands) {
    commands.execute(this.commandName, data);
  };
  return Action;
})();
exports.Action = Action;
