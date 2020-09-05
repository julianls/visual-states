'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.Matrix = void 0;
var Matrix = /** @class */ (function () {
  function Matrix(m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44) {
    this.M11 = m11;
    this.M12 = m12;
    this.M13 = m13;
    this.M14 = m14;
    this.M21 = m21;
    this.M22 = m22;
    this.M23 = m23;
    this.M24 = m24;
    this.M31 = m31;
    this.M32 = m32;
    this.M33 = m33;
    this.M34 = m34;
    this.M41 = m41;
    this.M42 = m42;
    this.M43 = m43;
    this.M44 = m44;
  }
  Matrix.prototype.clone = function () {
    return new Matrix(
      this.M11,
      this.M12,
      this.M13,
      this.M14,
      this.M21,
      this.M22,
      this.M23,
      this.M24,
      this.M31,
      this.M32,
      this.M33,
      this.M34,
      this.M41,
      this.M42,
      this.M43,
      this.M44,
    );
  };
  Matrix.prototype.equals = function (other) {
    return (
      this.M11 === other.M11 &&
      this.M22 === other.M22 &&
      this.M33 === other.M33 &&
      this.M44 === other.M44 &&
      this.M12 === other.M12 &&
      this.M13 === other.M13 &&
      this.M14 === other.M14 &&
      this.M21 === other.M21 &&
      this.M23 === other.M23 &&
      this.M24 === other.M24 &&
      this.M31 === other.M31 &&
      this.M32 === other.M32 &&
      this.M34 === other.M34 &&
      this.M41 === other.M41 &&
      this.M42 === other.M42 &&
      this.M43 === other.M43
    );
  };
  Matrix.add = function (matrix1, matrix2) {
    matrix1 = matrix1.clone();
    matrix1.M11 += matrix2.M11;
    matrix1.M12 += matrix2.M12;
    matrix1.M13 += matrix2.M13;
    matrix1.M14 += matrix2.M14;
    matrix1.M21 += matrix2.M21;
    matrix1.M22 += matrix2.M22;
    matrix1.M23 += matrix2.M23;
    matrix1.M24 += matrix2.M24;
    matrix1.M31 += matrix2.M31;
    matrix1.M32 += matrix2.M32;
    matrix1.M33 += matrix2.M33;
    matrix1.M34 += matrix2.M34;
    matrix1.M41 += matrix2.M41;
    matrix1.M42 += matrix2.M42;
    matrix1.M43 += matrix2.M43;
    matrix1.M44 += matrix2.M44;
    return matrix1;
  };
  Matrix.multiply = function (matrix1, matrix2) {
    matrix1 = matrix1.clone();
    var m11 =
      matrix1.M11 * matrix2.M11 + matrix1.M12 * matrix2.M21 + matrix1.M13 * matrix2.M31 + matrix1.M14 * matrix2.M41;
    var m12 =
      matrix1.M11 * matrix2.M12 + matrix1.M12 * matrix2.M22 + matrix1.M13 * matrix2.M32 + matrix1.M14 * matrix2.M42;
    var m13 =
      matrix1.M11 * matrix2.M13 + matrix1.M12 * matrix2.M23 + matrix1.M13 * matrix2.M33 + matrix1.M14 * matrix2.M43;
    var m14 =
      matrix1.M11 * matrix2.M14 + matrix1.M12 * matrix2.M24 + matrix1.M13 * matrix2.M34 + matrix1.M14 * matrix2.M44;
    var m21 =
      matrix1.M21 * matrix2.M11 + matrix1.M22 * matrix2.M21 + matrix1.M23 * matrix2.M31 + matrix1.M24 * matrix2.M41;
    var m22 =
      matrix1.M21 * matrix2.M12 + matrix1.M22 * matrix2.M22 + matrix1.M23 * matrix2.M32 + matrix1.M24 * matrix2.M42;
    var m23 =
      matrix1.M21 * matrix2.M13 + matrix1.M22 * matrix2.M23 + matrix1.M23 * matrix2.M33 + matrix1.M24 * matrix2.M43;
    var m24 =
      matrix1.M21 * matrix2.M14 + matrix1.M22 * matrix2.M24 + matrix1.M23 * matrix2.M34 + matrix1.M24 * matrix2.M44;
    var m31 =
      matrix1.M31 * matrix2.M11 + matrix1.M32 * matrix2.M21 + matrix1.M33 * matrix2.M31 + matrix1.M34 * matrix2.M41;
    var m32 =
      matrix1.M31 * matrix2.M12 + matrix1.M32 * matrix2.M22 + matrix1.M33 * matrix2.M32 + matrix1.M34 * matrix2.M42;
    var m33 =
      matrix1.M31 * matrix2.M13 + matrix1.M32 * matrix2.M23 + matrix1.M33 * matrix2.M33 + matrix1.M34 * matrix2.M43;
    var m34 =
      matrix1.M31 * matrix2.M14 + matrix1.M32 * matrix2.M24 + matrix1.M33 * matrix2.M34 + matrix1.M34 * matrix2.M44;
    var m41 =
      matrix1.M41 * matrix2.M11 + matrix1.M42 * matrix2.M21 + matrix1.M43 * matrix2.M31 + matrix1.M44 * matrix2.M41;
    var m42 =
      matrix1.M41 * matrix2.M12 + matrix1.M42 * matrix2.M22 + matrix1.M43 * matrix2.M32 + matrix1.M44 * matrix2.M42;
    var m43 =
      matrix1.M41 * matrix2.M13 + matrix1.M42 * matrix2.M23 + matrix1.M43 * matrix2.M33 + matrix1.M44 * matrix2.M43;
    var m44 =
      matrix1.M41 * matrix2.M14 + matrix1.M42 * matrix2.M24 + matrix1.M43 * matrix2.M34 + matrix1.M44 * matrix2.M44;
    matrix1.M11 = m11;
    matrix1.M12 = m12;
    matrix1.M13 = m13;
    matrix1.M14 = m14;
    matrix1.M21 = m21;
    matrix1.M22 = m22;
    matrix1.M23 = m23;
    matrix1.M24 = m24;
    matrix1.M31 = m31;
    matrix1.M32 = m32;
    matrix1.M33 = m33;
    matrix1.M34 = m34;
    matrix1.M41 = m41;
    matrix1.M42 = m42;
    matrix1.M43 = m43;
    matrix1.M44 = m44;
    return matrix1;
  };
  Matrix.createScale = function (xScale, yScale, zScale) {
    var result = new Matrix(xScale, 0, 0, 0, 0, yScale, 0, 0, 0, 0, zScale, 0, 0, 0, 0, 1);
    return result;
  };
  Matrix.createRotationZ = function (radians) {
    var returnMatrix = Matrix.identity.clone();
    var val1 = Math.cos(radians);
    var val2 = Math.sin(radians);
    returnMatrix.M11 = val1;
    returnMatrix.M12 = val2;
    returnMatrix.M21 = -val2;
    returnMatrix.M22 = val1;
    return returnMatrix;
  };
  Matrix.createTranslation = function (xPosition, yPosition, zPosition) {
    var result = new Matrix(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, xPosition, yPosition, zPosition, 1);
    return result;
  };
  Matrix.createMirror = function (flipX, flipY) {
    var result = Matrix.identity.clone();
    if (flipY) result.M11 = -1;
    if (flipX) result.M22 = -1;
    return result;
  };
  Matrix.identity = new Matrix(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
  return Matrix;
})();
exports.Matrix = Matrix;
