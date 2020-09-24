import { OnInit, EventEmitter, ElementRef, AfterViewInit, OnChanges } from '@angular/core';
import { ISurfaceDraw, IDrawable, IPoint } from 'my-libs/base-draw';
import { Point } from 'my-libs/base-geometry';
import { SurfaceData } from './surface-data';
import * as i0 from "@angular/core";
export declare class SurfaceDrawComponent implements OnInit, OnChanges, AfterViewInit, ISurfaceDraw {
    canvasRef: ElementRef;
    divElement: any;
    drawItems: IDrawable[];
    private offscreenCanvas;
    private scaleValue;
    private offsetXValue;
    private offsetYValue;
    private widthValue;
    private heightValue;
    private switchValue;
    drawAxises: boolean;
    scaleChange: EventEmitter<any>;
    offsetXChange: EventEmitter<any>;
    offsetYChange: EventEmitter<any>;
    widthChange: EventEmitter<any>;
    heightChange: EventEmitter<any>;
    private center;
    private pointerPosition;
    private context;
    private canvasValid;
    private isPan;
    down: EventEmitter<SurfaceData>;
    move: EventEmitter<SurfaceData>;
    up: EventEmitter<SurfaceData>;
    wheelRotate: EventEmitter<SurfaceData>;
    private stateEvent;
    constructor();
    set scale(val: number);
    get scale(): number;
    set offsetX(val: number);
    get offsetX(): number;
    set offsetY(val: number);
    get offsetY(): number;
    get width(): number;
    set width(val: number);
    get height(): number;
    set height(val: number);
    set switch(val: boolean);
    get switch(): boolean;
    get mousePosition(): IPoint;
    ngOnInit(): void;
    ngAfterViewInit(): void;
    private resizeCanvas;
    ngOnChanges(): void;
    invalidateDrawing(): void;
    line(x1: number, y1: number, x2: number, y2: number, strokeStyle?: string): void;
    polyline(points: IPoint[], strokeStyle?: string): void;
    polygon(points: IPoint[], strokeStyle?: string, fillStyle?: string): void;
    bezierCurve(x1: number, y1: number, cp1x: number, cp1y: number, cp2x: number, cp2y: number, x2: number, y2: number, strokeStyle?: string): void;
    rect(x1: number, y1: number, w: number, h: number, strokeStyle?: string): void;
    text(text: string, x: number, y: number, font?: string, strokeStyle?: string): void;
    image(img: ImageBitmap, x: number, y: number, width: number, height: number, scale: number): void;
    fromDeviceScale(val: number): number;
    toDeviceScale(val: number): number;
    toDeviceX(val: number): number;
    toDeviceY(val: number): number;
    getCenter(): Point;
    drawData(): void;
    drawOffscreen(): void;
    toLogical(point: Point): Point;
    drawHorizontalRuler(): void;
    drawVerticalRuler(): void;
    drawRulerText(x: number, y: number, horizontal: boolean): void;
    drawGrid(): void;
    private drawCoordinateSystem;
    onMousedown(event: any): void;
    onMousemove(event: MouseEvent): void;
    onMouseup(event: MouseEvent): void;
    protected onPanStart(event: any): void;
    protected onPanMove(event: any): void;
    protected onPanEnd(event: any): void;
    onMousewheel(event: any): void;
    static ɵfac: i0.ɵɵFactoryDef<SurfaceDrawComponent, never>;
    static ɵcmp: i0.ɵɵComponentDefWithMeta<SurfaceDrawComponent, "lib-surface-draw", never, { "drawItems": "drawItems"; "drawAxises": "drawAxises"; "scale": "scale"; "offsetX": "offsetX"; "offsetY": "offsetY"; "width": "width"; "height": "height"; "switch": "switch"; }, { "scaleChange": "scaleChange"; "offsetXChange": "offsetXChange"; "offsetYChange": "offsetYChange"; "widthChange": "widthChange"; "heightChange": "heightChange"; "down": "down"; "move": "move"; "up": "up"; "wheelRotate": "wheelRotate"; }, never, never>;
}