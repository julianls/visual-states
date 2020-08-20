'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.State = void 0;
var State = /** @class */ (function () {
  function State(name) {
    this.name = name;
    this.entryActions = [];
    this.exitActions = [];
  }
  return State;
})();
exports.State = State;
