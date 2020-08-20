'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.CommandContainer = void 0;
var CommandContainer = /** @class */ (function () {
  function CommandContainer() {
    this.commands = {};
  }
  CommandContainer.prototype.register = function (id, command) {
    this.commands[id] = command;
  };
  CommandContainer.prototype.execute = function (id, data) {
    var command = this.commands[id];
    if (command) return command.execute(data);
    else return false;
  };
  return CommandContainer;
})();
exports.CommandContainer = CommandContainer;
