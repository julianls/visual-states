export declare class Matrix {
    M11: number;
    M12: number;
    M13: number;
    M14: number;
    M21: number;
    M22: number;
    M23: number;
    M24: number;
    M31: number;
    M32: number;
    M33: number;
    M34: number;
    M41: number;
    M42: number;
    M43: number;
    M44: number;
    private static identity;
    constructor(m11: number, m12: number, m13: number, m14: number, m21: number, m22: number, m23: number, m24: number, m31: number, m32: number, m33: number, m34: number, m41: number, m42: number, m43: number, m44: number);
    clone(): Matrix;
    equals(other: Matrix): boolean;
    static add(matrix1: Matrix, matrix2: Matrix): Matrix;
    static multiply(matrix1: Matrix, matrix2: Matrix): Matrix;
    static createScale(xScale: number, yScale: number, zScale: number): Matrix;
    static createRotationZ(radians: number): Matrix;
    static createTranslation(xPosition: number, yPosition: number, zPosition: number): Matrix;
    static createMirror(flipX: boolean, flipY: boolean): Matrix;
}
