import { IPoint } from '../interfaces/point';
export declare class PolygonExtensions {
    static IsInPolygon(point: IPoint, polygon: IPoint[]): boolean;
    static getCurvePoints(pts: IPoint[], tension?: number, isClosed?: boolean, numOfSegments?: number): IPoint[];
}
