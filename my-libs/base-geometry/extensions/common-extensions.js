'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.CommonExtensions = void 0;
var CommonExtensions = /** @class */ (function () {
  function CommonExtensions() {}
  CommonExtensions.isAlmostSame = function (val1, val2, min) {
    if (min === void 0) {
      min = 0.01;
    }
    return Math.abs(val1 - val2) < min;
  };
  CommonExtensions.isAlmostSamePosition = function (val1x, val1y, val2x, val2y, min) {
    if (min === void 0) {
      min = 0.01;
    }
    return Math.abs(val1x - val2x) < min && Math.abs(val1y - val2y) < min;
  };
  return CommonExtensions;
})();
exports.CommonExtensions = CommonExtensions;
