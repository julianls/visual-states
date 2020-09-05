import { IPoint } from '../interfaces/point';
import { ILine } from '../interfaces/line';
import { Matrix } from '../matrices/matrix';
import { Point } from '../point';
export declare class LineExtensions {
    private static TOL;
    static distance(line: ILine, pt: IPoint): number;
    static distanceXY(x: number, y: number, x1: number, y1: number, x2: number, y2: number): number;
    static transform(line: ILine, matrix: Matrix): ILine;
    static getPointProjection(x1: number, y1: number, x2: number, y2: number, toProject: IPoint): IPoint;
    static lineIntersect(A: Point, B: Point, E: Point, F: Point, infinite: boolean): IPoint;
}
