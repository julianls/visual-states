'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.PointExtensions = void 0;
var point_1 = require('../point');
var matrix_1 = require('../matrices/matrix');
var PointExtensions = /** @class */ (function () {
  function PointExtensions() {}
  PointExtensions.distance = function (pt1, pt2) {
    return PointExtensions.distanceXY(pt1.x, pt1.y, pt2.x, pt2.y);
  };
  PointExtensions.distanceXY = function (x, y, x1, y1) {
    var v1 = x - x1;
    var v2 = y - y1;
    return Math.sqrt(v1 * v1 + v2 * v2);
  };
  PointExtensions.transform = function (position, matrix) {
    var result = new point_1.Point(
      position.x * matrix.M11 + position.y * matrix.M21 + matrix.M41,
      position.x * matrix.M12 + position.y * matrix.M22 + matrix.M42,
    );
    return result;
  };
  PointExtensions.getPosition = function (x, y, translation, rotation, isflipped) {
    var result = new point_1.Point(x, y);
    var matrix = matrix_1.Matrix.createTranslation(translation.x, translation.y, 0);
    if (rotation !== 0) {
      matrix = matrix_1.Matrix.add(matrix, matrix_1.Matrix.createRotationZ(rotation));
    }
    if (isflipped) {
      matrix = matrix_1.Matrix.add(matrix, matrix_1.Matrix.createMirror(true, false));
    }
    result = PointExtensions.transform(result, matrix);
    return result;
  };
  return PointExtensions;
})();
exports.PointExtensions = PointExtensions;
