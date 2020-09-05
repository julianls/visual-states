'use strict';
/*
 * Public API Surface of base-geometry
 */
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        Object.defineProperty(o, k2, {
          enumerable: true,
          get: function () {
            return m[k];
          },
        });
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __exportStar =
  (this && this.__exportStar) ||
  function (m, exports) {
    for (var p in m) if (p !== 'default' && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
  };
Object.defineProperty(exports, '__esModule', { value: true });
__exportStar(require('./interfaces/point'), exports);
__exportStar(require('./interfaces/line'), exports);
__exportStar(require('./point'), exports);
__exportStar(require('./line'), exports);
__exportStar(require('./rect'), exports);
__exportStar(require('./matrices/matrix'), exports);
__exportStar(require('./extensions/common-extensions'), exports);
__exportStar(require('./extensions/point-extensions'), exports);
__exportStar(require('./extensions/line-extensions'), exports);
__exportStar(require('./extensions/polygon-extensions'), exports);
