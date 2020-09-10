'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.LineExtensions = void 0;
var line_1 = require('../line');
var point_1 = require('../point');
var point_extensions_1 = require('./point-extensions');
var LineExtensions = /** @class */ (function () {
  function LineExtensions() {}
  LineExtensions.distance = function (line, pt) {
    return LineExtensions.distanceXY(line.first.x, line.first.y, line.second.x, line.second.y, pt.x, pt.y);
  };
  LineExtensions.distanceXY = function (lsX, lsY, leX, leY, x, y) {
    var ptProject = LineExtensions.getPointProjectionOnSegment(
      new point_1.Point(x, y),
      new point_1.Point(lsX, lsY),
      new point_1.Point(leX, leY),
    );
    return point_extensions_1.PointExtensions.distanceXY(x, y, ptProject.x, ptProject.y);
  };
  LineExtensions.transform = function (line, matrix) {
    var pos1 = new point_1.Point(
      line.first.x * matrix.M11 + line.first.y * matrix.M21 + matrix.M41,
      line.first.x * matrix.M12 + line.first.y * matrix.M22 + matrix.M42,
    );
    var pos2 = new point_1.Point(
      line.second.x * matrix.M11 + line.second.y * matrix.M21 + matrix.M41,
      line.second.x * matrix.M12 + line.second.y * matrix.M22 + matrix.M42,
    );
    return new line_1.Line(pos1, pos2);
  };
  LineExtensions.getPointProjection = function (x1, y1, x2, y2, toProject) {
    var deltaY = y2 - y1;
    if (deltaY === 0) deltaY = 0.000000000001;
    var deltaX = x2 - x1;
    if (deltaX === 0) deltaX = 0.000000000001;
    var m = deltaY / deltaX;
    var b = y1 - m * x1;
    var x = (m * toProject.y + toProject.x - m * b) / (m * m + 1);
    var y = (m * m * toProject.y + m * toProject.x + b) / (m * m + 1);
    return new point_1.Point(x, y);
  };
  LineExtensions.getPointProjectionOnSegment = function (p, a, b) {
    var atob = { x: b.x - a.x, y: b.y - a.y };
    var atop = { x: p.x - a.x, y: p.y - a.y };
    var len = atob.x * atob.x + atob.y * atob.y;
    var dot = atop.x * atob.x + atop.y * atob.y;
    var t = Math.min(1, Math.max(0, dot / len));
    dot = (b.x - a.x) * (p.y - a.y) - (b.y - a.y) * (p.x - a.x);
    return new point_1.Point(a.x + atob.x * t, a.y + atob.y * t);
  };
  LineExtensions.lineIntersect = function (A, B, E, F, infinite) {
    var x = 0;
    var y = 0;
    var a1 = B.y - A.y;
    var b1 = A.x - B.x;
    var c1 = B.x * A.y - A.x * B.y;
    var a2 = F.y - E.y;
    var b2 = E.x - F.x;
    var c2 = F.x * E.y - E.x * F.y;
    var denom = a1 * b2 - a2 * b1;
    (x = (b1 * c2 - b2 * c1) / denom), (y = (a2 * c1 - a1 * c2) / denom);
    if (!isFinite(x) || !isFinite(y)) {
      return null;
    }
    // lines are colinear
    /*var crossABE = (E.y - A.y) * (B.x - A.x) - (E.x - A.x) * (B.y - A.y);
            var crossABF = (F.y - A.y) * (B.x - A.x) - (F.x - A.x) * (B.y - A.y);
            if(_almostEqual(crossABE,0) && _almostEqual(crossABF,0)){
                return null;
            }*/
    if (!infinite) {
      // coincident points do not count as intersecting
      if (Math.abs(A.x - B.x) > LineExtensions.TOL && (A.x < B.x ? x < A.x || x > B.x : x > A.x || x < B.x))
        return null;
      if (Math.abs(A.y - B.y) > LineExtensions.TOL && (A.y < B.y ? y < A.y || y > B.y : y > A.y || y < B.y))
        return null;
      if (Math.abs(E.x - F.x) > LineExtensions.TOL && (E.x < F.x ? x < E.x || x > F.x : x > E.x || x < F.x))
        return null;
      if (Math.abs(E.y - F.y) > LineExtensions.TOL && (E.y < F.y ? y < E.y || y > F.y : y > E.y || y < F.y))
        return null;
    }
    return new point_1.Point(x, y);
  };
  LineExtensions.TOL = Math.pow(10, -9);
  return LineExtensions;
})();
exports.LineExtensions = LineExtensions;
