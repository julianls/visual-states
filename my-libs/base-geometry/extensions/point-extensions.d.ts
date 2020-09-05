import { IPoint } from '..';
import { Point } from '../point';
import { Matrix } from '../matrices/matrix';
export declare class PointExtensions {
    static distance(pt1: IPoint, pt2: IPoint): number;
    static distanceXY(x: number, y: number, x1: number, y1: number): number;
    static transform(position: IPoint, matrix: Matrix): IPoint;
    static getPosition(x: number, y: number, translation: Point, rotation: number, isflipped: boolean): IPoint;
}
