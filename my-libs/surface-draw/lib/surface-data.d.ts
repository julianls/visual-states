import { Point } from 'my-libs/base-geometry';
import { ISurfaceDraw } from 'my-libs/base-draw';
export declare class SurfaceData {
    screenPoint: Point;
    modelPoint: Point;
    surface: ISurfaceDraw;
    event: any;
    stateEvent: any;
    constructor(screenPoint: Point, modelPoint: Point, surface: ISurfaceDraw, event: any, stateEvent: any);
}
