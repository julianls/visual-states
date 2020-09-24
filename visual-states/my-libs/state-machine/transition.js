'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.Transition = void 0;
var Transition = /** @class */ (function () {
  function Transition(event) {
    this.event = event;
    this.actions = [];
    this.condition = null;
  }
  Transition.prototype.isValid = function (event, data, commands) {
    if (event !== this.event) return false;
    if (this.condition === null) return true;
    return this.condition.isValid(event, data, commands);
  };
  Transition.prototype.execute = function (context, data, commands) {
    for (var _i = 0, _a = this.actions; _i < _a.length; _i++) {
      var action = _a[_i];
      action.execute(data, commands);
    }
    return context.findState(this.targetState.name);
  };
  return Transition;
})();
exports.Transition = Transition;
