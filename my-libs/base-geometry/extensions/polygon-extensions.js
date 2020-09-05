'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.PolygonExtensions = void 0;
var PolygonExtensions = /** @class */ (function () {
  function PolygonExtensions() {}
  PolygonExtensions.IsInPolygon = function (point, polygon) {
    var result = false;
    var a = polygon[polygon.length - 1];
    for (var _i = 0, polygon_1 = polygon; _i < polygon_1.length; _i++) {
      var b = polygon_1[_i];
      if (b.x === point.x && b.y === point.y) return true;
      if (b.y === a.y && point.y === a.y && a.x <= point.x && point.x <= b.x) return true;
      if ((b.y < point.y && a.y >= point.y) || (a.y < point.y && b.y >= point.y)) {
        if (b.x + ((point.y - b.y) / (a.y - b.y)) * (a.x - b.x) <= point.x) result = !result;
      }
      a = b;
    }
    return result;
  };
  PolygonExtensions.getCurvePoints = function (pts, tension, isClosed, numOfSegments) {
    if (tension === void 0) {
      tension = 0.5;
    }
    if (isClosed === void 0) {
      isClosed = false;
    }
    if (numOfSegments === void 0) {
      numOfSegments = 16;
    }
    // use input value if provided, or use a default value
    tension = typeof tension !== 'undefined' ? tension : 0.5;
    isClosed = isClosed ? isClosed : false;
    numOfSegments = numOfSegments ? numOfSegments : 16;
    var res = []; // clone array
    var x = 0;
    var y = 0; // our x,y coords
    var t1x = 0;
    var t2x = 0;
    var t1y = 0;
    var t2y = 0; // tension vectors
    var c1 = 0;
    var c2 = 0;
    var c3 = 0;
    var c4 = 0; // cardinal points
    var st = 0;
    var t = 0;
    var i = 0; // steps based on num. of segments
    // clone array so we don't change the original
    var _pts = pts.slice(0);
    // The algorithm require a previous and next point to the actual point array.
    // Check if we will draw closed or open curve.
    // If closed, copy end points to beginning and first points to end
    // If open, duplicate first points to befinning, end points to end
    if (isClosed) {
      _pts.unshift(pts[pts.length - 1]);
      _pts.unshift(pts[pts.length - 1]);
      _pts.push(pts[0]);
      _pts.push(pts[1]);
    } else {
      _pts.unshift(pts[0]); // copy 1. point and insert at beginning
      _pts.push(pts[pts.length - 1]); // copy last point and append
    }
    // ok, lets start..
    // 1. loop goes through point array
    // 2. loop goes through each segment between the 2 pts + 1e point before and after
    for (i = 1; i < _pts.length - 2; i++) {
      for (t = 0; t <= numOfSegments; t++) {
        var pt0 = _pts[i - 1];
        var pt1 = _pts[i];
        var pt2 = _pts[i + 1];
        var pt3 = _pts[i + 2];
        // calc tension vectors
        t1x = (pt2.x - pt0.x) * tension;
        t2x = (pt3.x - pt1.x) * tension;
        t1y = (pt2.y - pt0.y) * tension;
        t2y = (pt3.y - pt1.y) * tension;
        // calc step
        st = t / numOfSegments;
        // calc cardinals
        c1 = 2 * Math.pow(st, 3) - 3 * Math.pow(st, 2) + 1;
        c2 = -(2 * Math.pow(st, 3)) + 3 * Math.pow(st, 2);
        c3 = Math.pow(st, 3) - 2 * Math.pow(st, 2) + st;
        c4 = Math.pow(st, 3) - Math.pow(st, 2);
        // calc x and y cords with common control vectors
        x = c1 * pt1.x + c2 * pt2.x + c3 * t1x + c4 * t2x;
        y = c1 * pt1.y + c2 * pt2.y + c3 * t1y + c4 * t2y;
        // store points in array
        if (res.length === 0 || res[res.length - 1].x !== x || res[res.length - 1].y !== y) res.push({ x: x, y: y });
      }
    }
    return res;
  };
  return PolygonExtensions;
})();
exports.PolygonExtensions = PolygonExtensions;
