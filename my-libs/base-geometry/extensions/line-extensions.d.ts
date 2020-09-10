import { IPoint } from '../interfaces/point';
import { ILine } from '../interfaces/line';
import { Matrix } from '../matrices/matrix';
import { Point } from '../point';
export declare class LineExtensions {
    private static TOL;
    static distance(line: ILine, pt: IPoint): number;
    static distanceXY(lsX: number, lsY: number, leX: number, leY: number, x: number, y: number): number;
    static transform(line: ILine, matrix: Matrix): ILine;
    static getPointProjection(x1: number, y1: number, x2: number, y2: number, toProject: IPoint): IPoint;
    static getPointProjectionOnSegment(p: IPoint, a: IPoint, b: IPoint): IPoint;
    static lineIntersect(A: Point, B: Point, E: Point, F: Point, infinite: boolean): IPoint;
}
