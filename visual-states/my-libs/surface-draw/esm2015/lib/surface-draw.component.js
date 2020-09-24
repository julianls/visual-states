import { Component, ViewChild, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { Point } from 'my-libs/base-geometry';
import { SurfaceData } from './surface-data';
import * as i0 from "@angular/core";
const _c0 = ["myCanvas"];
const _c1 = ["divElement"];
export class SurfaceDrawComponent {
    constructor() {
        this.scaleValue = 1;
        this.offsetXValue = 0;
        this.offsetYValue = 0;
        this.widthValue = 0;
        this.heightValue = 0;
        this.switchValue = false;
        this.drawAxises = false;
        this.scaleChange = new EventEmitter();
        this.offsetXChange = new EventEmitter();
        this.offsetYChange = new EventEmitter();
        this.widthChange = new EventEmitter();
        this.heightChange = new EventEmitter();
        this.center = new Point(0, 0);
        this.pointerPosition = new Point(0, 0);
        this.canvasValid = false;
        // private lastRefreshHandle: number;
        // private cancelRefreshCounter: number = 0;
        this.isPan = false;
        this.down = new EventEmitter();
        this.move = new EventEmitter();
        this.up = new EventEmitter();
        this.wheelRotate = new EventEmitter();
        // @Output() click: EventEmitter<Point> = new EventEmitter<Point>();
        this.stateEvent = null;
    }
    set scale(val) {
        if (this.scaleValue !== val) {
            this.scaleValue = val;
            this.scaleChange.emit(this.scaleValue);
        }
    }
    get scale() {
        return this.scaleValue;
    }
    set offsetX(val) {
        if (this.offsetXValue !== val) {
            this.offsetXValue = val;
            this.offsetXChange.emit(this.offsetXValue);
        }
    }
    get offsetX() {
        return this.offsetXValue;
    }
    set offsetY(val) {
        if (this.offsetXValue !== val) {
            this.offsetYValue = val;
            this.offsetYChange.emit(this.offsetYValue);
        }
    }
    get offsetY() {
        return this.offsetYValue;
    }
    get width() {
        return this.widthValue;
    }
    set width(val) {
        if (this.widthValue !== val) {
            this.widthValue = val;
            this.widthChange.emit(this.widthValue);
        }
    }
    get height() {
        return this.heightValue;
    }
    set height(val) {
        if (this.heightValue !== val) {
            this.heightValue = val;
            this.heightChange.emit(this.heightValue);
        }
    }
    set switch(val) {
        if (this.switchValue !== val) {
            this.switchValue = val;
            this.invalidateDrawing();
        }
    }
    get switch() {
        return this.switchValue;
    }
    get mousePosition() {
        return this.pointerPosition;
    }
    ngOnInit() {
        this.offscreenCanvas = document.createElement('canvas');
        this.canvasValid = true;
    }
    ngAfterViewInit() {
        // this.context = this.canvasRef.nativeElement.getContext('2d');
        this.context = this.offscreenCanvas.getContext('2d', { alpha: false });
        window.onresize = this.resizeCanvas.bind(this);
        requestAnimationFrame(() => this.resizeCanvas(this.divElement));
    }
    resizeCanvas(_) {
        const el = this.divElement.nativeElement;
        this.width = el.clientWidth;
        this.height = el.clientHeight;
        this.offscreenCanvas.width = this.width;
        this.offscreenCanvas.height = this.height;
        this.canvasRef.nativeElement.width = el.clientWidth;
        this.canvasRef.nativeElement.height = el.clientHeight;
        this.invalidateDrawing();
    }
    ngOnChanges() {
        // this.context = this.canvasRef.nativeElement.getContext('2d');
        if (this.offscreenCanvas) {
            this.context = this.offscreenCanvas.getContext('2d', { alpha: false });
            this.invalidateDrawing();
        }
    }
    invalidateDrawing() {
        if (this.canvasValid) {
            this.canvasValid = false;
            // this.cancelRefreshCounter++;
            // if (this.cancelRefreshCounter < 10)
            //  cancelAnimationFrame(this.lastRefreshHandle);
            // else
            //  this.cancelRefreshCounter = 0;
            // this.lastRefreshHandle = requestAnimationFrame(() => this.drawOffscreen());
            requestAnimationFrame(() => this.drawOffscreen());
        }
    }
    line(x1, y1, x2, y2, strokeStyle = '#F3E5F5') {
        this.context.strokeStyle = strokeStyle;
        this.context.beginPath();
        this.context.moveTo(this.toDeviceX(x1), this.toDeviceY(y1));
        this.context.lineTo(this.toDeviceX(x2), this.toDeviceY(y2));
        this.context.stroke();
    }
    polyline(points, strokeStyle = '#F3E5F5') {
        this.context.strokeStyle = strokeStyle;
        this.context.beginPath();
        for (let i = 0; i < points.length; i++) {
            if (i === 0) {
                this.context.moveTo(this.toDeviceX(points[i].x), this.toDeviceY(points[i].y));
            }
            else {
                this.context.lineTo(this.toDeviceX(points[i].x), this.toDeviceY(points[i].y));
            }
        }
        this.context.stroke();
    }
    polygon(points, strokeStyle = '#F3E5F5', fillStyle) {
        this.context.strokeStyle = strokeStyle;
        this.context.beginPath();
        for (let i = 0; i < points.length; i++) {
            if (i === 0) {
                this.context.moveTo(this.toDeviceX(points[i].x), this.toDeviceY(points[i].y));
            }
            else {
                this.context.lineTo(this.toDeviceX(points[i].x), this.toDeviceY(points[i].y));
            }
        }
        this.context.closePath();
        if (fillStyle) {
            const oldFill = this.context.fillStyle;
            this.context.fillStyle = fillStyle;
            this.context.fill();
            this.context.fillStyle = oldFill;
        }
        this.context.stroke();
    }
    bezierCurve(x1, y1, cp1x, cp1y, cp2x, cp2y, x2, y2, strokeStyle = '#F3E5F5') {
        this.context.strokeStyle = strokeStyle;
        this.context.beginPath();
        this.context.moveTo(this.toDeviceX(x1), this.toDeviceY(y1));
        this.context.bezierCurveTo(this.toDeviceX(cp1x), this.toDeviceY(cp1y), this.toDeviceX(cp2x), this.toDeviceY(cp2y), this.toDeviceX(x2), this.toDeviceY(y2));
        this.context.stroke();
    }
    rect(x1, y1, w, h, strokeStyle = '#F3E5F5') {
        this.context.strokeStyle = strokeStyle;
        const width = this.toDeviceScale(w);
        const height = this.toDeviceScale(h);
        this.context.strokeRect(this.toDeviceX(x1), this.toDeviceY(y1) - height, width, height);
    }
    text(text, x, y, font = null, strokeStyle = '#F3E5F5') {
        x = this.toDeviceX(x);
        y = this.toDeviceY(y);
        /// color for background
        this.context.fillStyle = '#303030';
        /// get width of text
        const oldFont = this.context.font;
        if (font) {
            this.context.font = font;
        }
        const width = this.context.measureText(text).width;
        /// draw background rect assuming height of font
        this.context.fillRect(x - width / 2.0, y - 6, width, 12);
        this.context.fillStyle = strokeStyle;
        this.context.textBaseline = 'middle';
        this.context.textAlign = 'center';
        this.context.fillText(text, x, y, width);
        if (font) {
            this.context.font = oldFont;
        }
    }
    image(img, x, y, width, height, scale) {
        x = this.toDeviceX(x);
        y = this.toDeviceY(y);
        width = this.toDeviceScale(width * scale);
        height = this.toDeviceScale(height * scale);
        this.context.drawImage(img, 0, 0, img.width, img.height, x, y - height, width, height);
    }
    fromDeviceScale(val) {
        return val / this.scale;
    }
    toDeviceScale(val) {
        return val * this.scale;
    }
    toDeviceX(val) {
        return this.center.x +
            this.toDeviceScale(this.offsetX) +
            this.toDeviceScale(val);
    }
    toDeviceY(val) {
        return this.center.y -
            this.toDeviceScale(this.offsetY) -
            this.toDeviceScale(val);
    }
    getCenter() {
        const el = this.divElement.nativeElement;
        const centerX = el.clientWidth / 2.0 - el.offsetLeft / 2.0;
        const centerY = el.clientHeight / 2.0 - el.offsetTop / 2.0;
        return new Point(centerX, centerY);
    }
    drawData() {
        if (this.offscreenCanvas.width > 0 && this.offscreenCanvas.height > 0) {
            const ctx = this.canvasRef.nativeElement.getContext('2d', { alpha: false });
            ctx.clearRect(0, 0, this.width, this.height);
            ctx.drawImage(this.offscreenCanvas, 0, 0);
        }
    }
    drawOffscreen() {
        if (!this.canvasValid) {
            this.canvasValid = true;
            this.center = this.getCenter();
            this.context.lineWidth = 1;
            this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
            this.context.fillStyle = '#303030';
            this.context.fillRect(0, 0, this.context.canvas.width, this.context.canvas.height);
            if (this.drawItems != null) {
                for (const entry of this.drawItems) {
                    if (entry.getLayer() < 0) {
                        entry.draw(this);
                    }
                }
            }
            this.drawGrid();
            if (this.drawItems != null) {
                for (const entry of this.drawItems) {
                    if (entry.getLayer() >= 0) {
                        entry.draw(this);
                    }
                }
            }
            this.drawVerticalRuler();
            this.drawHorizontalRuler();
            requestAnimationFrame(() => this.drawData());
        }
    }
    toLogical(point) {
        const result = new Point(point.x, point.y);
        result.x = this.fromDeviceScale(point.x) -
            this.offsetX -
            this.fromDeviceScale(this.center.x);
        result.y = -(this.fromDeviceScale(point.y - this.center.y) + this.offsetY);
        return result;
    }
    drawHorizontalRuler() {
        const center = new Point(this.center.x, this.center.y);
        center.x += this.toDeviceScale(this.offsetX);
        center.y -= this.toDeviceScale(this.offsetY);
        let step = this.toDeviceScale(10);
        while (step < 5) {
            step /= 0.40;
        }
        while (step > 15) {
            step *= 0.40;
        }
        this.context.lineWidth = 0.25;
        this.context.strokeStyle = '#FFFFFF';
        this.context.beginPath();
        let len = 10;
        let cnt = 0;
        for (let x = center.x; x >= 0; x -= step) {
            this.context.moveTo(x, 10);
            this.context.lineTo(x, len + 10);
            cnt++;
            if (len === 10) {
                this.drawRulerText(x, 0, true);
                cnt = 0;
                len = 5;
            }
            else if (cnt >= 4) {
                len = 10;
            }
        }
        len = 5;
        cnt = 0;
        for (let x = center.x + step; x <= this.context.canvas.width; x += step) {
            this.context.moveTo(x, 10);
            this.context.lineTo(x, len + 10);
            cnt++;
            if (len === 10) {
                this.drawRulerText(x, 0, true);
                cnt = 0;
                len = 5;
            }
            else if (cnt >= 4) {
                len = 10;
            }
        }
        this.context.closePath();
        this.context.stroke();
    }
    drawVerticalRuler() {
        const center = new Point(this.center.x, this.center.y);
        center.x += this.toDeviceScale(this.offsetX);
        center.y -= this.toDeviceScale(this.offsetY);
        let step = this.toDeviceScale(10);
        while (step < 5) {
            step /= 0.40;
        }
        while (step > 15) {
            step *= 0.40;
        }
        this.context.lineWidth = 0.25;
        this.context.strokeStyle = '#FFFFFF';
        this.context.beginPath();
        let len = 10;
        let cnt = 0;
        for (let y = center.y; y >= 0; y -= step) {
            this.context.moveTo(0, y);
            this.context.lineTo(len, y);
            cnt++;
            if (len === 10) {
                this.drawRulerText(12, y, false);
                cnt = 0;
                len = 5;
            }
            else if (cnt >= 4) {
                len = 10;
            }
        }
        len = 5;
        cnt = 0;
        for (let y = center.y + step; y <= this.context.canvas.height; y += step) {
            this.context.moveTo(0, y);
            this.context.lineTo(len, y);
            cnt++;
            if (len === 10) {
                this.drawRulerText(12, y, false);
                cnt = 0;
                len = 5;
            }
            else if (cnt >= 4) {
                len = 10;
            }
        }
        this.context.closePath();
        this.context.stroke();
    }
    drawRulerText(x, y, horizontal) {
        const logicalPt = this.toLogical(new Point(x, y));
        const text = horizontal ? Math.round(logicalPt.x).toString() : Math.round(logicalPt.y).toString();
        ///// color for background
        // this.context.fillStyle = '#303030';
        ///// get width of text
        const width = this.context.measureText(text).width;
        ///// draw background rect assuming height of font
        // this.context.fillRect(x - width / 2.0, y - 6, width, 12);
        this.context.fillStyle = '#FFFFFF4A';
        if (horizontal) {
            this.context.textBaseline = 'top';
        }
        else {
            this.context.textBaseline = 'middle';
        }
        if (horizontal) {
            this.context.textAlign = 'center';
        }
        else {
            this.context.textAlign = 'start';
        }
        this.context.fillText(text, x, y, width);
    }
    drawGrid() {
        const center = new Point(this.center.x, this.center.y);
        center.x += this.toDeviceScale(this.offsetX);
        center.y -= this.toDeviceScale(this.offsetY);
        let step = this.toDeviceScale(10);
        while (step < 5) {
            step /= 0.40;
        }
        while (step > 15) {
            step *= 0.40;
        }
        this.context.lineWidth = 0.25;
        this.context.strokeStyle = '#3C3C3C';
        // this.context.strokeStyle = "#FFFFFF";
        this.context.setLineDash([4, 2]);
        this.context.beginPath();
        for (let x = center.x; x >= 0; x -= step) {
            this.context.moveTo(x, 0);
            this.context.lineTo(x, this.context.canvas.height);
        }
        for (let x = center.x + step; x <= this.context.canvas.width; x += step) {
            this.context.moveTo(x, 0);
            this.context.lineTo(x, this.context.canvas.height);
        }
        for (let y = center.y; y >= 0; y -= step) {
            this.context.moveTo(0, y);
            this.context.lineTo(this.context.canvas.width, y);
        }
        for (let y = center.y + step; y <= this.context.canvas.height; y += step) {
            this.context.moveTo(0, y);
            this.context.lineTo(this.context.canvas.width, y);
        }
        this.context.closePath();
        this.context.stroke();
        step = step * 5;
        this.context.lineWidth = 0.5;
        this.context.strokeStyle = '#3C3C3C';
        this.context.beginPath();
        const hw = 0.5;
        const w = 1;
        for (let x = center.x; x >= 0; x -= step) {
            for (let y = center.y; y >= 0; y -= step) {
                this.context.strokeRect(x - hw, y - hw, w, w);
            }
            for (let y = center.y + step; y <= this.context.canvas.height; y += step) {
                this.context.strokeRect(x - hw, y - hw, w, w);
            }
        }
        for (let x = center.x + step; x <= this.context.canvas.width; x += step) {
            for (let y = center.y; y >= 0; y -= step) {
                this.context.strokeRect(x - hw, y - hw, w, w);
            }
            for (let y = center.y + step; y <= this.context.canvas.height; y += step) {
                this.context.strokeRect(x - hw, y - hw, w, w);
            }
        }
        this.context.closePath();
        this.context.stroke();
        this.context.setLineDash([]);
        // this.context.strokeStyle = "#000000";
        // this.context.lineWidth = 1;
        // this.context.beginPath();
        // this.context.strokeRect(center.x - 2, center.y - 2, 4, 4);
        // this.context.stroke();
        if (this.drawAxises) {
            this.drawCoordinateSystem();
        }
    }
    drawCoordinateSystem() {
        const calcHeight = this.height - this.divElement.nativeElement.offsetTop;
        this.context.lineWidth = 1;
        this.context.strokeStyle = '#00BFA5';
        this.context.beginPath();
        this.context.moveTo(40, calcHeight - 40);
        this.context.lineTo(40, calcHeight - 140);
        this.context.lineTo(45, calcHeight - 135);
        this.context.lineTo(35, calcHeight - 135);
        this.context.lineTo(40, calcHeight - 140);
        this.context.stroke();
        this.context.lineWidth = 1;
        this.context.strokeStyle = '#0091EA';
        this.context.beginPath();
        this.context.moveTo(40, calcHeight - 40);
        this.context.lineTo(140, calcHeight - 40);
        this.context.lineTo(135, calcHeight - 35);
        this.context.lineTo(135, calcHeight - 45);
        this.context.lineTo(140, calcHeight - 40);
        this.context.stroke();
    }
    onMousedown(event) {
        if (this.isPan) {
            return;
        }
        const pt = new Point(event.clientX, event.clientY - this.divElement.nativeElement.offsetTop);
        this.stateEvent = event;
        const sd = new SurfaceData(pt, this.toLogical(pt), this, event, this.stateEvent);
        this.down.emit(sd);
    }
    onMousemove(event) {
        if (this.isPan) {
            return;
        }
        const pt = new Point(event.clientX, event.clientY - this.divElement.nativeElement.offsetTop);
        const sd = new SurfaceData(pt, this.toLogical(pt), this, event, this.stateEvent);
        this.pointerPosition = sd.modelPoint;
        this.move.emit(sd);
    }
    onMouseup(event) {
        if (this.isPan) {
            return;
        }
        const pt = new Point(event.clientX, event.clientY - this.divElement.nativeElement.offsetTop);
        const sd = new SurfaceData(pt, this.toLogical(pt), this, event, this.stateEvent);
        this.up.emit(sd);
        this.stateEvent = event;
    }
    onPanStart(event) {
        if (event.pointerType === 'touch') {
            this.isPan = true;
            event.preventDefault();
            this.stateEvent = event;
            const pt = new Point(event.center.x, event.center.y - this.divElement.nativeElement.offsetTop);
            const sd = new SurfaceData(pt, this.toLogical(pt), this, event, this.stateEvent);
            this.down.emit(sd);
        }
    }
    onPanMove(event) {
        if (event.pointerType === 'touch') {
            event.preventDefault();
            const pt = new Point(event.center.x, event.center.y - this.divElement.nativeElement.offsetTop);
            const sd = new SurfaceData(pt, this.toLogical(pt), this, event, this.stateEvent);
            this.move.emit(sd);
        }
    }
    onPanEnd(event) {
        if (event.pointerType === 'touch') {
            this.isPan = false;
            event.preventDefault();
            const pt = new Point(event.center.x, event.center.y - this.divElement.nativeElement.offsetTop);
            const sd = new SurfaceData(pt, this.toLogical(pt), this, event, this.stateEvent);
            this.up.emit(sd);
            this.stateEvent = event;
        }
    }
    onMousewheel(event) {
        const pt = new Point(event.clientX, event.clientY - this.divElement.nativeElement.offsetTop);
        const sd = new SurfaceData(pt, this.toLogical(pt), this, event, this.stateEvent);
        this.wheelRotate.emit(sd);
    }
}
SurfaceDrawComponent.ɵfac = function SurfaceDrawComponent_Factory(t) { return new (t || SurfaceDrawComponent)(); };
SurfaceDrawComponent.ɵcmp = i0.ɵɵdefineComponent({ type: SurfaceDrawComponent, selectors: [["lib-surface-draw"]], viewQuery: function SurfaceDrawComponent_Query(rf, ctx) { if (rf & 1) {
        i0.ɵɵstaticViewQuery(_c0, true);
        i0.ɵɵstaticViewQuery(_c1, true);
    } if (rf & 2) {
        var _t;
        i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.canvasRef = _t.first);
        i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.divElement = _t.first);
    } }, hostBindings: function SurfaceDrawComponent_HostBindings(rf, ctx) { if (rf & 1) {
        i0.ɵɵlistener("mousedown", function SurfaceDrawComponent_mousedown_HostBindingHandler($event) { return ctx.onMousedown($event); })("mousemove", function SurfaceDrawComponent_mousemove_HostBindingHandler($event) { return ctx.onMousemove($event); })("mouseup", function SurfaceDrawComponent_mouseup_HostBindingHandler($event) { return ctx.onMouseup($event); })("panstart", function SurfaceDrawComponent_panstart_HostBindingHandler($event) { return ctx.onPanStart($event); })("panmove", function SurfaceDrawComponent_panmove_HostBindingHandler($event) { return ctx.onPanMove($event); })("panend", function SurfaceDrawComponent_panend_HostBindingHandler($event) { return ctx.onPanEnd($event); })("mousewheel", function SurfaceDrawComponent_mousewheel_HostBindingHandler($event) { return ctx.onMousewheel($event); });
    } }, inputs: { drawItems: "drawItems", drawAxises: "drawAxises", scale: "scale", offsetX: "offsetX", offsetY: "offsetY", width: "width", height: "height", switch: "switch" }, outputs: { scaleChange: "scaleChange", offsetXChange: "offsetXChange", offsetYChange: "offsetYChange", widthChange: "widthChange", heightChange: "heightChange", down: "down", move: "move", up: "up", wheelRotate: "wheelRotate" }, features: [i0.ɵɵNgOnChangesFeature], decls: 4, vars: 0, consts: [[1, "div-root"], ["divElement", ""], [1, "canvas-main"], ["myCanvas", ""]], template: function SurfaceDrawComponent_Template(rf, ctx) { if (rf & 1) {
        i0.ɵɵelementStart(0, "div", 0, 1);
        i0.ɵɵelement(2, "canvas", 2, 3);
        i0.ɵɵelementEnd();
    } }, styles: [".canvas-main[_ngcontent-%COMP%] {\n    touch-action: none !important;\n  }\n\n  .div-root[_ngcontent-%COMP%] {\n    position: fixed;\n    width: 100%;\n    height: 100%;\n  }"] });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(SurfaceDrawComponent, [{
        type: Component,
        args: [{
                selector: 'lib-surface-draw',
                template: `
  <div #divElement class="div-root">
    <canvas #myCanvas class="canvas-main">
    </canvas>
  </div>
  `,
                styles: [`
  .canvas-main {
    touch-action: none !important;
  }

  .div-root {
    position: fixed;
    width: 100%;
    height: 100%;
  }
  `]
            }]
    }], function () { return []; }, { canvasRef: [{
            type: ViewChild,
            args: ['myCanvas', { static: true }]
        }], divElement: [{
            type: ViewChild,
            args: ['divElement', { static: true }]
        }], drawItems: [{
            type: Input
        }], drawAxises: [{
            type: Input
        }], scaleChange: [{
            type: Output
        }], offsetXChange: [{
            type: Output
        }], offsetYChange: [{
            type: Output
        }], widthChange: [{
            type: Output
        }], heightChange: [{
            type: Output
        }], down: [{
            type: Output
        }], move: [{
            type: Output
        }], up: [{
            type: Output
        }], wheelRotate: [{
            type: Output
        }], scale: [{
            type: Input
        }], offsetX: [{
            type: Input
        }], offsetY: [{
            type: Input
        }], width: [{
            type: Input
        }], height: [{
            type: Input
        }], switch: [{
            type: Input
        }], onMousedown: [{
            type: HostListener,
            args: ['mousedown', ['$event']]
        }], onMousemove: [{
            type: HostListener,
            args: ['mousemove', ['$event']]
        }], onMouseup: [{
            type: HostListener,
            args: ['mouseup', ['$event']]
        }], onPanStart: [{
            type: HostListener,
            args: ['panstart', ['$event']]
        }], onPanMove: [{
            type: HostListener,
            args: ['panmove', ['$event']]
        }], onPanEnd: [{
            type: HostListener,
            args: ['panend', ['$event']]
        }], onMousewheel: [{
            type: HostListener,
            args: ['mousewheel', ['$event']]
        }] }); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3VyZmFjZS1kcmF3LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL3N1cmZhY2UtZHJhdy9zcmMvbGliL3N1cmZhY2UtZHJhdy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBVSxTQUFTLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQXdDLFlBQVksRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUU5SSxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFDOUMsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGdCQUFnQixDQUFDOzs7O0FBc0I3QyxNQUFNLE9BQU8sb0JBQW9CO0lBeUMvQjtRQWpDUSxlQUFVLEdBQUcsQ0FBQyxDQUFDO1FBQ2YsaUJBQVksR0FBRyxDQUFDLENBQUM7UUFDakIsaUJBQVksR0FBRyxDQUFDLENBQUM7UUFDakIsZUFBVSxHQUFHLENBQUMsQ0FBQztRQUNmLGdCQUFXLEdBQUcsQ0FBQyxDQUFDO1FBQ2hCLGdCQUFXLEdBQUcsS0FBSyxDQUFDO1FBRW5CLGVBQVUsR0FBRyxLQUFLLENBQUM7UUFFbEIsZ0JBQVcsR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO1FBQ2pDLGtCQUFhLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUNuQyxrQkFBYSxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7UUFDbkMsZ0JBQVcsR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO1FBQ2pDLGlCQUFZLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUVwQyxXQUFNLEdBQVUsSUFBSSxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ2hDLG9CQUFlLEdBQVUsSUFBSSxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBR3pDLGdCQUFXLEdBQUcsS0FBSyxDQUFDO1FBQzVCLHFDQUFx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QUFFLENBQUMsUUFBUSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQsIFZpZXdDaGlsZCwgSW5wdXQsIE91dHB1dCwgRXZlbnRFbWl0dGVyLCBFbGVtZW50UmVmLCBBZnRlclZpZXdJbml0LCBPbkNoYW5nZXMsIEhvc3RMaXN0ZW5lciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgSVN1cmZhY2VEcmF3LCBJRHJhd2FibGUsIElQb2ludCB9IGZyb20gJ215LWxpYnMvYmFzZS1kcmF3JztcbmltcG9ydCB7IFBvaW50IH0gZnJvbSAnbXktbGlicy9iYXNlLWdlb21ldHJ5JztcbmltcG9ydCB7IFN1cmZhY2VEYXRhIH0gZnJvbSAnLi9zdXJmYWNlLWRhdGEnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdsaWItc3VyZmFjZS1kcmF3JyxcbiAgdGVtcGxhdGU6IGBcbiAgPGRpdiAjZGl2RWxlbWVudCBjbGFzcz1cImRpdi1yb290XCI+XG4gICAgPGNhbnZhcyAjbXlDYW52YXMgY2xhc3M9XCJjYW52YXMtbWFpblwiPlxuICAgIDwvY2FudmFzPlxuICA8L2Rpdj5cbiAgYCxcbiAgc3R5bGVzOiBbYFxuICAuY2FudmFzLW1haW4ge1xuICAgIHRvdWNoLWFjdGlvbjogbm9uZSAhaW1wb3J0YW50O1xuICB9XG5cbiAgLmRpdi1yb290IHtcbiAgICBwb3NpdGlvbjogZml4ZWQ7XG4gICAgd2lkdGg6IDEwMCU7XG4gICAgaGVpZ2h0OiAxMDAlO1xuICB9XG4gIGBdXG59KVxuZXhwb3J0IGNsYXNzIFN1cmZhY2VEcmF3Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMsIEFmdGVyVmlld0luaXQsIElTdXJmYWNlRHJhdyB7XG4gIEBWaWV3Q2hpbGQoJ215Q2FudmFzJywgeyBzdGF0aWM6IHRydWUgfSkgY2FudmFzUmVmOiBFbGVtZW50UmVmO1xuICBAVmlld0NoaWxkKCdkaXZFbGVtZW50JywgeyBzdGF0aWM6IHRydWUgfSkgZGl2RWxlbWVudDogYW55O1xuXG4gIEBJbnB1dCgpIGRyYXdJdGVtczogSURyYXdhYmxlW107XG5cbiAgcHJpdmF0ZSBvZmZzY3JlZW5DYW52YXM6IEhUTUxDYW52YXNFbGVtZW50O1xuXG4gIHByaXZhdGUgc2NhbGVWYWx1ZSA9IDE7XG4gIHByaXZhdGUgb2Zmc2V0WFZhbHVlID0gMDtcbiAgcHJpdmF0ZSBvZmZzZXRZVmFsdWUgPSAwO1xuICBwcml2YXRlIHdpZHRoVmFsdWUgPSAwO1xuICBwcml2YXRlIGhlaWdodFZhbHVlID0gMDtcbiAgcHJpdmF0ZSBzd2l0Y2hWYWx1ZSA9IGZhbHNlO1xuXG4gIEBJbnB1dCgpIGRyYXdBeGlzZXMgPSBmYWxzZTtcblxuICBAT3V0cHV0KCkgc2NhbGVDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoKSBvZmZzZXRYQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCkgb2Zmc2V0WUNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgQE91dHB1dCgpIHdpZHRoQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCkgaGVpZ2h0Q2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gIHByaXZhdGUgY2VudGVyOiBQb2ludCA9IG5ldyBQb2ludCgwLCAwKTtcbiAgcHJpdmF0ZSBwb2ludGVyUG9zaXRpb246IFBvaW50ID0gbmV3IFBvaW50KDAsIDApO1xuXG4gIHByaXZhdGUgY29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xuICBwcml2YXRlIGNhbnZhc1ZhbGlkID0gZmFsc2U7XG4gIC8vIHByaXZhdGUgbGFzdFJlZnJlc2hIYW5kbGU6IG51bWJlcjtcbiAgLy8gcHJpdmF0ZSBjYW5jZWxSZWZyZXNoQ291bnRlcjogbnVtYmVyID0gMDtcblxuICBwcml2YXRlIGlzUGFuID0gZmFsc2U7XG5cbiAgQE91dHB1dCgpIGRvd246IEV2ZW50RW1pdHRlcjxTdXJmYWNlRGF0YT4gPSBuZXcgRXZlbnRFbWl0dGVyPFN1cmZhY2VEYXRhPigpO1xuICBAT3V0cHV0KCkgbW92ZTogRXZlbnRFbWl0dGVyPFN1cmZhY2VEYXRhPiA9IG5ldyBFdmVudEVtaXR0ZXI8U3VyZmFjZURhdGE+KCk7XG4gIEBPdXRwdXQoKSB1cDogRXZlbnRFbWl0dGVyPFN1cmZhY2VEYXRhPiA9IG5ldyBFdmVudEVtaXR0ZXI8U3VyZmFjZURhdGE+KCk7XG4gIEBPdXRwdXQoKSB3aGVlbFJvdGF0ZTogRXZlbnRFbWl0dGVyPFN1cmZhY2VEYXRhPiA9IG5ldyBFdmVudEVtaXR0ZXI8U3VyZmFjZURhdGE+KCk7XG4gIC8vIEBPdXRwdXQoKSBjbGljazogRXZlbnRFbWl0dGVyPFBvaW50PiA9IG5ldyBFdmVudEVtaXR0ZXI8UG9pbnQ+KCk7XG5cbiAgcHJpdmF0ZSBzdGF0ZUV2ZW50OiBhbnkgPSBudWxsO1xuXG4gIGNvbnN0cnVjdG9yKCkgeyB9XG5cbiAgQElucHV0KClcbiAgc2V0IHNjYWxlKHZhbCkge1xuICAgIGlmICh0aGlzLnNjYWxlVmFsdWUgIT09IHZhbCkge1xuICAgICAgdGhpcy5zY2FsZVZhbHVlID0gdmFsO1xuICAgICAgdGhpcy5zY2FsZUNoYW5nZS5lbWl0KHRoaXMuc2NhbGVWYWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgZ2V0IHNjYWxlKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuc2NhbGVWYWx1ZTtcbiAgfVxuXG4gIEBJbnB1dCgpXG4gIHNldCBvZmZzZXRYKHZhbCkge1xuICAgIGlmICh0aGlzLm9mZnNldFhWYWx1ZSAhPT0gdmFsKSB7XG4gICAgICB0aGlzLm9mZnNldFhWYWx1ZSA9IHZhbDtcbiAgICAgIHRoaXMub2Zmc2V0WENoYW5nZS5lbWl0KHRoaXMub2Zmc2V0WFZhbHVlKTtcbiAgICB9XG4gIH1cblxuICBnZXQgb2Zmc2V0WCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLm9mZnNldFhWYWx1ZTtcbiAgfVxuXG4gIEBJbnB1dCgpXG4gIHNldCBvZmZzZXRZKHZhbCkge1xuICAgIGlmICh0aGlzLm9mZnNldFhWYWx1ZSAhPT0gdmFsKSB7XG4gICAgICB0aGlzLm9mZnNldFlWYWx1ZSA9IHZhbDtcbiAgICAgIHRoaXMub2Zmc2V0WUNoYW5nZS5lbWl0KHRoaXMub2Zmc2V0WVZhbHVlKTtcbiAgICB9XG4gIH1cblxuICBnZXQgb2Zmc2V0WSgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLm9mZnNldFlWYWx1ZTtcbiAgfVxuXG4gIGdldCB3aWR0aCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLndpZHRoVmFsdWU7XG4gIH1cblxuICBASW5wdXQoKVxuICBzZXQgd2lkdGgodmFsKSB7XG4gICAgaWYgKHRoaXMud2lkdGhWYWx1ZSAhPT0gdmFsKSB7XG4gICAgICB0aGlzLndpZHRoVmFsdWUgPSB2YWw7XG4gICAgICB0aGlzLndpZHRoQ2hhbmdlLmVtaXQodGhpcy53aWR0aFZhbHVlKTtcbiAgICB9XG4gIH1cblxuICBnZXQgaGVpZ2h0KCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuaGVpZ2h0VmFsdWU7XG4gIH1cblxuICBASW5wdXQoKVxuICBzZXQgaGVpZ2h0KHZhbCkge1xuICAgIGlmICh0aGlzLmhlaWdodFZhbHVlICE9PSB2YWwpIHtcbiAgICAgIHRoaXMuaGVpZ2h0VmFsdWUgPSB2YWw7XG4gICAgICB0aGlzLmhlaWdodENoYW5nZS5lbWl0KHRoaXMuaGVpZ2h0VmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIEBJbnB1dCgpXG4gIHNldCBzd2l0Y2godmFsKSB7XG4gICAgaWYgKHRoaXMuc3dpdGNoVmFsdWUgIT09IHZhbCkge1xuICAgICAgdGhpcy5zd2l0Y2hWYWx1ZSA9IHZhbDtcbiAgICAgIHRoaXMuaW52YWxpZGF0ZURyYXdpbmcoKTtcbiAgICB9XG4gIH1cblxuICBnZXQgc3dpdGNoKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnN3aXRjaFZhbHVlO1xuICB9XG5cbiAgZ2V0IG1vdXNlUG9zaXRpb24oKTogSVBvaW50IHtcbiAgICByZXR1cm4gdGhpcy5wb2ludGVyUG9zaXRpb247XG4gIH1cblxuICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLm9mZnNjcmVlbkNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuICAgIHRoaXMuY2FudmFzVmFsaWQgPSB0cnVlO1xuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCk6IHZvaWQge1xuICAgIC8vIHRoaXMuY29udGV4dCA9IHRoaXMuY2FudmFzUmVmLm5hdGl2ZUVsZW1lbnQuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICB0aGlzLmNvbnRleHQgPSB0aGlzLm9mZnNjcmVlbkNhbnZhcy5nZXRDb250ZXh0KCcyZCcsIHsgYWxwaGE6IGZhbHNlIH0pO1xuICAgIHdpbmRvdy5vbnJlc2l6ZSA9IHRoaXMucmVzaXplQ2FudmFzLmJpbmQodGhpcyk7XG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHRoaXMucmVzaXplQ2FudmFzKHRoaXMuZGl2RWxlbWVudCkpO1xuICB9XG5cbiAgcHJpdmF0ZSByZXNpemVDYW52YXMoXzogVUlFdmVudCk6IHZvaWQge1xuICAgIGNvbnN0IGVsOiBIVE1MRGl2RWxlbWVudCA9IHRoaXMuZGl2RWxlbWVudC5uYXRpdmVFbGVtZW50O1xuICAgIHRoaXMud2lkdGggPSBlbC5jbGllbnRXaWR0aDtcbiAgICB0aGlzLmhlaWdodCA9IGVsLmNsaWVudEhlaWdodDtcbiAgICB0aGlzLm9mZnNjcmVlbkNhbnZhcy53aWR0aCA9IHRoaXMud2lkdGg7XG4gICAgdGhpcy5vZmZzY3JlZW5DYW52YXMuaGVpZ2h0ID0gdGhpcy5oZWlnaHQ7XG4gICAgdGhpcy5jYW52YXNSZWYubmF0aXZlRWxlbWVudC53aWR0aCA9IGVsLmNsaWVudFdpZHRoO1xuICAgIHRoaXMuY2FudmFzUmVmLm5hdGl2ZUVsZW1lbnQuaGVpZ2h0ID0gZWwuY2xpZW50SGVpZ2h0O1xuICAgIHRoaXMuaW52YWxpZGF0ZURyYXdpbmcoKTtcbiAgfVxuXG5cbiAgbmdPbkNoYW5nZXMoKTogdm9pZCB7XG4gICAgLy8gdGhpcy5jb250ZXh0ID0gdGhpcy5jYW52YXNSZWYubmF0aXZlRWxlbWVudC5nZXRDb250ZXh0KCcyZCcpO1xuICAgIGlmICh0aGlzLm9mZnNjcmVlbkNhbnZhcykge1xuICAgICAgdGhpcy5jb250ZXh0ID0gdGhpcy5vZmZzY3JlZW5DYW52YXMuZ2V0Q29udGV4dCgnMmQnLCB7IGFscGhhOiBmYWxzZSB9KTtcbiAgICAgIHRoaXMuaW52YWxpZGF0ZURyYXdpbmcoKTtcbiAgICB9XG4gIH1cblxuICBpbnZhbGlkYXRlRHJhd2luZygpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5jYW52YXNWYWxpZCkge1xuICAgICAgdGhpcy5jYW52YXNWYWxpZCA9IGZhbHNlO1xuICAgICAgLy8gdGhpcy5jYW5jZWxSZWZyZXNoQ291bnRlcisrO1xuICAgICAgLy8gaWYgKHRoaXMuY2FuY2VsUmVmcmVzaENvdW50ZXIgPCAxMClcbiAgICAgIC8vICBjYW5jZWxBbmltYXRpb25GcmFtZSh0aGlzLmxhc3RSZWZyZXNoSGFuZGxlKTtcbiAgICAgIC8vIGVsc2VcbiAgICAgIC8vICB0aGlzLmNhbmNlbFJlZnJlc2hDb3VudGVyID0gMDtcbiAgICAgIC8vIHRoaXMubGFzdFJlZnJlc2hIYW5kbGUgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4gdGhpcy5kcmF3T2Zmc2NyZWVuKCkpO1xuICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHRoaXMuZHJhd09mZnNjcmVlbigpKTtcbiAgICB9XG4gIH1cblxuICBsaW5lKHgxOiBudW1iZXIsIHkxOiBudW1iZXIsIHgyOiBudW1iZXIsIHkyOiBudW1iZXIsIHN0cm9rZVN0eWxlOiBzdHJpbmcgPSAnI0YzRTVGNScpOiB2b2lkIHtcbiAgICB0aGlzLmNvbnRleHQuc3Ryb2tlU3R5bGUgPSBzdHJva2VTdHlsZTtcbiAgICB0aGlzLmNvbnRleHQuYmVnaW5QYXRoKCk7XG4gICAgdGhpcy5jb250ZXh0Lm1vdmVUbyh0aGlzLnRvRGV2aWNlWCh4MSksIHRoaXMudG9EZXZpY2VZKHkxKSk7XG4gICAgdGhpcy5jb250ZXh0LmxpbmVUbyh0aGlzLnRvRGV2aWNlWCh4MiksIHRoaXMudG9EZXZpY2VZKHkyKSk7XG4gICAgdGhpcy5jb250ZXh0LnN0cm9rZSgpO1xuICB9XG5cbiAgcG9seWxpbmUocG9pbnRzOiBJUG9pbnRbXSwgc3Ryb2tlU3R5bGU6IHN0cmluZyA9ICcjRjNFNUY1Jyk6IHZvaWQge1xuICAgIHRoaXMuY29udGV4dC5zdHJva2VTdHlsZSA9IHN0cm9rZVN0eWxlO1xuICAgIHRoaXMuY29udGV4dC5iZWdpblBhdGgoKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBvaW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKGkgPT09IDApIHtcbiAgICAgICAgdGhpcy5jb250ZXh0Lm1vdmVUbyh0aGlzLnRvRGV2aWNlWChwb2ludHNbaV0ueCksIHRoaXMudG9EZXZpY2VZKHBvaW50c1tpXS55KSk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgdGhpcy5jb250ZXh0LmxpbmVUbyh0aGlzLnRvRGV2aWNlWChwb2ludHNbaV0ueCksIHRoaXMudG9EZXZpY2VZKHBvaW50c1tpXS55KSk7XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuY29udGV4dC5zdHJva2UoKTtcbiAgfVxuXG4gIHBvbHlnb24ocG9pbnRzOiBJUG9pbnRbXSwgc3Ryb2tlU3R5bGU6IHN0cmluZyA9ICcjRjNFNUY1JywgZmlsbFN0eWxlPzogc3RyaW5nKTogdm9pZCB7XG4gICAgdGhpcy5jb250ZXh0LnN0cm9rZVN0eWxlID0gc3Ryb2tlU3R5bGU7XG4gICAgdGhpcy5jb250ZXh0LmJlZ2luUGF0aCgpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcG9pbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoaSA9PT0gMCkge1xuICAgICAgICB0aGlzLmNvbnRleHQubW92ZVRvKHRoaXMudG9EZXZpY2VYKHBvaW50c1tpXS54KSwgdGhpcy50b0RldmljZVkocG9pbnRzW2ldLnkpKTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICB0aGlzLmNvbnRleHQubGluZVRvKHRoaXMudG9EZXZpY2VYKHBvaW50c1tpXS54KSwgdGhpcy50b0RldmljZVkocG9pbnRzW2ldLnkpKTtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5jb250ZXh0LmNsb3NlUGF0aCgpO1xuXG4gICAgaWYgKGZpbGxTdHlsZSkge1xuICAgICAgY29uc3Qgb2xkRmlsbCA9IHRoaXMuY29udGV4dC5maWxsU3R5bGU7XG4gICAgICB0aGlzLmNvbnRleHQuZmlsbFN0eWxlID0gZmlsbFN0eWxlO1xuICAgICAgdGhpcy5jb250ZXh0LmZpbGwoKTtcbiAgICAgIHRoaXMuY29udGV4dC5maWxsU3R5bGUgPSBvbGRGaWxsO1xuICAgIH1cblxuICAgIHRoaXMuY29udGV4dC5zdHJva2UoKTtcbiAgfVxuXG4gIGJlemllckN1cnZlKHgxOiBudW1iZXIsIHkxOiBudW1iZXIsIGNwMXg6IG51bWJlciwgY3AxeTogbnVtYmVyLCBjcDJ4OiBudW1iZXIsIGNwMnk6IG51bWJlciwgeDI6IG51bWJlciwgeTI6IG51bWJlciwgc3Ryb2tlU3R5bGU6IHN0cmluZyA9ICcjRjNFNUY1Jyk6IHZvaWQge1xuICAgIHRoaXMuY29udGV4dC5zdHJva2VTdHlsZSA9IHN0cm9rZVN0eWxlO1xuICAgIHRoaXMuY29udGV4dC5iZWdpblBhdGgoKTtcbiAgICB0aGlzLmNvbnRleHQubW92ZVRvKHRoaXMudG9EZXZpY2VYKHgxKSwgdGhpcy50b0RldmljZVkoeTEpKTtcbiAgICB0aGlzLmNvbnRleHQuYmV6aWVyQ3VydmVUbyh0aGlzLnRvRGV2aWNlWChjcDF4KSwgdGhpcy50b0RldmljZVkoY3AxeSksXG4gICAgICB0aGlzLnRvRGV2aWNlWChjcDJ4KSwgdGhpcy50b0RldmljZVkoY3AyeSksIHRoaXMudG9EZXZpY2VYKHgyKSwgdGhpcy50b0RldmljZVkoeTIpKTtcbiAgICB0aGlzLmNvbnRleHQuc3Ryb2tlKCk7XG4gIH1cblxuICByZWN0KHgxOiBudW1iZXIsIHkxOiBudW1iZXIsIHc6IG51bWJlciwgaDogbnVtYmVyLCBzdHJva2VTdHlsZTogc3RyaW5nID0gJyNGM0U1RjUnKTogdm9pZCB7XG4gICAgdGhpcy5jb250ZXh0LnN0cm9rZVN0eWxlID0gc3Ryb2tlU3R5bGU7XG4gICAgY29uc3Qgd2lkdGggPSB0aGlzLnRvRGV2aWNlU2NhbGUodyk7XG4gICAgY29uc3QgaGVpZ2h0ID0gdGhpcy50b0RldmljZVNjYWxlKGgpO1xuICAgIHRoaXMuY29udGV4dC5zdHJva2VSZWN0KHRoaXMudG9EZXZpY2VYKHgxKSwgdGhpcy50b0RldmljZVkoeTEpIC0gaGVpZ2h0LCB3aWR0aCwgaGVpZ2h0KTtcbiAgfVxuXG4gIHRleHQodGV4dDogc3RyaW5nLCB4OiBudW1iZXIsIHk6IG51bWJlciwgZm9udDogc3RyaW5nID0gbnVsbCwgc3Ryb2tlU3R5bGU6IHN0cmluZyA9ICcjRjNFNUY1Jyk6IHZvaWQge1xuICAgIHggPSB0aGlzLnRvRGV2aWNlWCh4KTtcbiAgICB5ID0gdGhpcy50b0RldmljZVkoeSk7XG4gICAgLy8vIGNvbG9yIGZvciBiYWNrZ3JvdW5kXG4gICAgdGhpcy5jb250ZXh0LmZpbGxTdHlsZSA9ICcjMzAzMDMwJztcbiAgICAvLy8gZ2V0IHdpZHRoIG9mIHRleHRcbiAgICBjb25zdCBvbGRGb250ID0gdGhpcy5jb250ZXh0LmZvbnQ7XG4gICAgaWYgKGZvbnQpIHtcbiAgICAgIHRoaXMuY29udGV4dC5mb250ID0gZm9udDtcbiAgICB9XG4gICAgY29uc3Qgd2lkdGggPSB0aGlzLmNvbnRleHQubWVhc3VyZVRleHQodGV4dCkud2lkdGg7XG4gICAgLy8vIGRyYXcgYmFja2dyb3VuZCByZWN0IGFzc3VtaW5nIGhlaWdodCBvZiBmb250XG4gICAgdGhpcy5jb250ZXh0LmZpbGxSZWN0KHggLSB3aWR0aCAvIDIuMCwgeSAtIDYsIHdpZHRoLCAxMik7XG5cbiAgICB0aGlzLmNvbnRleHQuZmlsbFN0eWxlID0gc3Ryb2tlU3R5bGU7XG4gICAgdGhpcy5jb250ZXh0LnRleHRCYXNlbGluZSA9ICdtaWRkbGUnO1xuICAgIHRoaXMuY29udGV4dC50ZXh0QWxpZ24gPSAnY2VudGVyJztcbiAgICB0aGlzLmNvbnRleHQuZmlsbFRleHQodGV4dCwgeCwgeSwgd2lkdGgpO1xuICAgIGlmIChmb250KSB7XG4gICAgICB0aGlzLmNvbnRleHQuZm9udCA9IG9sZEZvbnQ7XG4gICAgfVxuICB9XG5cbiAgaW1hZ2UoaW1nOiBJbWFnZUJpdG1hcCwgeDogbnVtYmVyLCB5OiBudW1iZXIsIHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyLCBzY2FsZTogbnVtYmVyKTogdm9pZCB7XG4gICAgeCA9IHRoaXMudG9EZXZpY2VYKHgpO1xuICAgIHkgPSB0aGlzLnRvRGV2aWNlWSh5KTtcbiAgICB3aWR0aCA9IHRoaXMudG9EZXZpY2VTY2FsZSh3aWR0aCAqIHNjYWxlKTtcbiAgICBoZWlnaHQgPSB0aGlzLnRvRGV2aWNlU2NhbGUoaGVpZ2h0ICogc2NhbGUpO1xuXG4gICAgdGhpcy5jb250ZXh0LmRyYXdJbWFnZShpbWcsIDAsIDAsIGltZy53aWR0aCwgaW1nLmhlaWdodCwgeCwgeSAtIGhlaWdodCwgd2lkdGgsIGhlaWdodCk7XG4gIH1cblxuICBmcm9tRGV2aWNlU2NhbGUodmFsOiBudW1iZXIpOiBudW1iZXIge1xuICAgIHJldHVybiB2YWwgLyB0aGlzLnNjYWxlO1xuICB9XG5cbiAgdG9EZXZpY2VTY2FsZSh2YWw6IG51bWJlcik6IG51bWJlciB7XG4gICAgcmV0dXJuIHZhbCAqIHRoaXMuc2NhbGU7XG4gIH1cblxuICB0b0RldmljZVgodmFsOiBudW1iZXIpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLmNlbnRlci54ICtcbiAgICAgIHRoaXMudG9EZXZpY2VTY2FsZSh0aGlzLm9mZnNldFgpICtcbiAgICAgIHRoaXMudG9EZXZpY2VTY2FsZSh2YWwpO1xuICB9XG5cbiAgdG9EZXZpY2VZKHZhbDogbnVtYmVyKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5jZW50ZXIueSAtXG4gICAgICB0aGlzLnRvRGV2aWNlU2NhbGUodGhpcy5vZmZzZXRZKSAtXG4gICAgICB0aGlzLnRvRGV2aWNlU2NhbGUodmFsKTtcbiAgfVxuXG4gIGdldENlbnRlcigpOiBQb2ludCB7XG4gICAgY29uc3QgZWw6IEhUTUxEaXZFbGVtZW50ID0gdGhpcy5kaXZFbGVtZW50Lm5hdGl2ZUVsZW1lbnQ7XG4gICAgY29uc3QgY2VudGVyWCA9IGVsLmNsaWVudFdpZHRoIC8gMi4wIC0gZWwub2Zmc2V0TGVmdCAvIDIuMDtcbiAgICBjb25zdCBjZW50ZXJZID0gZWwuY2xpZW50SGVpZ2h0IC8gMi4wIC0gZWwub2Zmc2V0VG9wIC8gMi4wO1xuICAgIHJldHVybiBuZXcgUG9pbnQoY2VudGVyWCwgY2VudGVyWSk7XG4gIH1cblxuICBkcmF3RGF0YSgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5vZmZzY3JlZW5DYW52YXMud2lkdGggPiAwICYmIHRoaXMub2Zmc2NyZWVuQ2FudmFzLmhlaWdodCA+IDApIHtcbiAgICAgIGNvbnN0IGN0eCA9IHRoaXMuY2FudmFzUmVmLm5hdGl2ZUVsZW1lbnQuZ2V0Q29udGV4dCgnMmQnLCB7IGFscGhhOiBmYWxzZSB9KTtcbiAgICAgIGN0eC5jbGVhclJlY3QoMCwgMCwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xuICAgICAgY3R4LmRyYXdJbWFnZSh0aGlzLm9mZnNjcmVlbkNhbnZhcywgMCwgMCk7XG4gICAgfVxuICB9XG5cbiAgZHJhd09mZnNjcmVlbigpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuY2FudmFzVmFsaWQpIHtcbiAgICAgIHRoaXMuY2FudmFzVmFsaWQgPSB0cnVlO1xuICAgICAgdGhpcy5jZW50ZXIgPSB0aGlzLmdldENlbnRlcigpO1xuXG4gICAgICB0aGlzLmNvbnRleHQubGluZVdpZHRoID0gMTtcbiAgICAgIHRoaXMuY29udGV4dC5jbGVhclJlY3QoMCwgMCwgdGhpcy5jb250ZXh0LmNhbnZhcy53aWR0aCwgdGhpcy5jb250ZXh0LmNhbnZhcy5oZWlnaHQpO1xuICAgICAgdGhpcy5jb250ZXh0LmZpbGxTdHlsZSA9ICcjMzAzMDMwJztcbiAgICAgIHRoaXMuY29udGV4dC5maWxsUmVjdCgwLCAwLCB0aGlzLmNvbnRleHQuY2FudmFzLndpZHRoLCB0aGlzLmNvbnRleHQuY2FudmFzLmhlaWdodCk7XG5cbiAgICAgIGlmICh0aGlzLmRyYXdJdGVtcyAhPSBudWxsKSB7XG4gICAgICAgIGZvciAoY29uc3QgZW50cnkgb2YgdGhpcy5kcmF3SXRlbXMpIHtcbiAgICAgICAgICBpZiAoZW50cnkuZ2V0TGF5ZXIoKSA8IDApIHtcbiAgICAgICAgICAgIGVudHJ5LmRyYXcodGhpcyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRoaXMuZHJhd0dyaWQoKTtcblxuICAgICAgaWYgKHRoaXMuZHJhd0l0ZW1zICE9IG51bGwpIHtcbiAgICAgICAgZm9yIChjb25zdCBlbnRyeSBvZiB0aGlzLmRyYXdJdGVtcykge1xuICAgICAgICAgIGlmIChlbnRyeS5nZXRMYXllcigpID49IDApIHtcbiAgICAgICAgICAgIGVudHJ5LmRyYXcodGhpcyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRoaXMuZHJhd1ZlcnRpY2FsUnVsZXIoKTtcbiAgICAgIHRoaXMuZHJhd0hvcml6b250YWxSdWxlcigpO1xuXG4gICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4gdGhpcy5kcmF3RGF0YSgpKTtcbiAgICB9XG4gIH1cblxuICB0b0xvZ2ljYWwocG9pbnQ6IFBvaW50KTogUG9pbnQge1xuICAgIGNvbnN0IHJlc3VsdCA9IG5ldyBQb2ludChwb2ludC54LCBwb2ludC55KTtcblxuICAgIHJlc3VsdC54ID0gdGhpcy5mcm9tRGV2aWNlU2NhbGUocG9pbnQueCkgLVxuICAgICAgdGhpcy5vZmZzZXRYIC1cbiAgICAgIHRoaXMuZnJvbURldmljZVNjYWxlKHRoaXMuY2VudGVyLngpO1xuXG4gICAgcmVzdWx0LnkgPSAtKHRoaXMuZnJvbURldmljZVNjYWxlKHBvaW50LnkgLSB0aGlzLmNlbnRlci55KSArIHRoaXMub2Zmc2V0WSk7XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgZHJhd0hvcml6b250YWxSdWxlcigpOiB2b2lkIHtcbiAgICBjb25zdCBjZW50ZXIgPSBuZXcgUG9pbnQodGhpcy5jZW50ZXIueCwgdGhpcy5jZW50ZXIueSk7XG4gICAgY2VudGVyLnggKz0gdGhpcy50b0RldmljZVNjYWxlKHRoaXMub2Zmc2V0WCk7XG4gICAgY2VudGVyLnkgLT0gdGhpcy50b0RldmljZVNjYWxlKHRoaXMub2Zmc2V0WSk7XG4gICAgbGV0IHN0ZXAgPSB0aGlzLnRvRGV2aWNlU2NhbGUoMTApO1xuXG4gICAgd2hpbGUgKHN0ZXAgPCA1KSB7XG4gICAgICBzdGVwIC89IDAuNDA7XG4gICAgfVxuXG4gICAgd2hpbGUgKHN0ZXAgPiAxNSkge1xuICAgICAgc3RlcCAqPSAwLjQwO1xuICAgIH1cblxuICAgIHRoaXMuY29udGV4dC5saW5lV2lkdGggPSAwLjI1O1xuICAgIHRoaXMuY29udGV4dC5zdHJva2VTdHlsZSA9ICcjRkZGRkZGJztcbiAgICB0aGlzLmNvbnRleHQuYmVnaW5QYXRoKCk7XG5cbiAgICBsZXQgbGVuID0gMTA7XG4gICAgbGV0IGNudCA9IDA7XG5cbiAgICBmb3IgKGxldCB4ID0gY2VudGVyLng7IHggPj0gMDsgeCAtPSBzdGVwKSB7XG4gICAgICB0aGlzLmNvbnRleHQubW92ZVRvKHgsIDEwKTtcbiAgICAgIHRoaXMuY29udGV4dC5saW5lVG8oeCwgbGVuICsgMTApO1xuXG4gICAgICBjbnQrKztcbiAgICAgIGlmIChsZW4gPT09IDEwKSB7XG4gICAgICAgIHRoaXMuZHJhd1J1bGVyVGV4dCh4LCAwLCB0cnVlKTtcbiAgICAgICAgY250ID0gMDtcbiAgICAgICAgbGVuID0gNTtcbiAgICAgIH0gZWxzZSBpZiAoY250ID49IDQpIHtcbiAgICAgICAgbGVuID0gMTA7XG4gICAgICB9XG4gICAgfVxuXG4gICAgbGVuID0gNTtcbiAgICBjbnQgPSAwO1xuXG4gICAgZm9yIChsZXQgeCA9IGNlbnRlci54ICsgc3RlcDsgeCA8PSB0aGlzLmNvbnRleHQuY2FudmFzLndpZHRoOyB4ICs9IHN0ZXApIHtcbiAgICAgIHRoaXMuY29udGV4dC5tb3ZlVG8oeCwgMTApO1xuICAgICAgdGhpcy5jb250ZXh0LmxpbmVUbyh4LCBsZW4gKyAxMCk7XG5cbiAgICAgIGNudCsrO1xuICAgICAgaWYgKGxlbiA9PT0gMTApIHtcbiAgICAgICAgdGhpcy5kcmF3UnVsZXJUZXh0KHgsIDAsIHRydWUpO1xuICAgICAgICBjbnQgPSAwO1xuICAgICAgICBsZW4gPSA1O1xuICAgICAgfSBlbHNlIGlmIChjbnQgPj0gNCkge1xuICAgICAgICBsZW4gPSAxMDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmNvbnRleHQuY2xvc2VQYXRoKCk7XG4gICAgdGhpcy5jb250ZXh0LnN0cm9rZSgpO1xuICB9XG5cbiAgZHJhd1ZlcnRpY2FsUnVsZXIoKTogdm9pZCB7XG4gICAgY29uc3QgY2VudGVyID0gbmV3IFBvaW50KHRoaXMuY2VudGVyLngsIHRoaXMuY2VudGVyLnkpO1xuICAgIGNlbnRlci54ICs9IHRoaXMudG9EZXZpY2VTY2FsZSh0aGlzLm9mZnNldFgpO1xuICAgIGNlbnRlci55IC09IHRoaXMudG9EZXZpY2VTY2FsZSh0aGlzLm9mZnNldFkpO1xuICAgIGxldCBzdGVwID0gdGhpcy50b0RldmljZVNjYWxlKDEwKTtcblxuICAgIHdoaWxlIChzdGVwIDwgNSkge1xuICAgICAgc3RlcCAvPSAwLjQwO1xuICAgIH1cblxuICAgIHdoaWxlIChzdGVwID4gMTUpIHtcbiAgICAgIHN0ZXAgKj0gMC40MDtcbiAgICB9XG5cbiAgICB0aGlzLmNvbnRleHQubGluZVdpZHRoID0gMC4yNTtcbiAgICB0aGlzLmNvbnRleHQuc3Ryb2tlU3R5bGUgPSAnI0ZGRkZGRic7XG5cbiAgICB0aGlzLmNvbnRleHQuYmVnaW5QYXRoKCk7XG5cbiAgICBsZXQgbGVuID0gMTA7XG4gICAgbGV0IGNudCA9IDA7XG5cbiAgICBmb3IgKGxldCB5ID0gY2VudGVyLnk7IHkgPj0gMDsgeSAtPSBzdGVwKSB7XG4gICAgICB0aGlzLmNvbnRleHQubW92ZVRvKDAsIHkpO1xuICAgICAgdGhpcy5jb250ZXh0LmxpbmVUbyhsZW4sIHkpO1xuXG4gICAgICBjbnQrKztcbiAgICAgIGlmIChsZW4gPT09IDEwKSB7XG4gICAgICAgIHRoaXMuZHJhd1J1bGVyVGV4dCgxMiwgeSwgZmFsc2UpO1xuICAgICAgICBjbnQgPSAwO1xuICAgICAgICBsZW4gPSA1O1xuICAgICAgfSBlbHNlIGlmIChjbnQgPj0gNCkge1xuICAgICAgICBsZW4gPSAxMDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBsZW4gPSA1O1xuICAgIGNudCA9IDA7XG5cbiAgICBmb3IgKGxldCB5ID0gY2VudGVyLnkgKyBzdGVwOyB5IDw9IHRoaXMuY29udGV4dC5jYW52YXMuaGVpZ2h0OyB5ICs9IHN0ZXApIHtcbiAgICAgIHRoaXMuY29udGV4dC5tb3ZlVG8oMCwgeSk7XG4gICAgICB0aGlzLmNvbnRleHQubGluZVRvKGxlbiwgeSk7XG5cbiAgICAgIGNudCsrO1xuICAgICAgaWYgKGxlbiA9PT0gMTApIHtcbiAgICAgICAgdGhpcy5kcmF3UnVsZXJUZXh0KDEyLCB5LCBmYWxzZSk7XG4gICAgICAgIGNudCA9IDA7XG4gICAgICAgIGxlbiA9IDU7XG4gICAgICB9IGVsc2UgaWYgKGNudCA+PSA0KSB7XG4gICAgICAgIGxlbiA9IDEwO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuY29udGV4dC5jbG9zZVBhdGgoKTtcbiAgICB0aGlzLmNvbnRleHQuc3Ryb2tlKCk7XG4gIH1cblxuICBkcmF3UnVsZXJUZXh0KHg6IG51bWJlciwgeTogbnVtYmVyLCBob3Jpem9udGFsOiBib29sZWFuKTogdm9pZCB7XG4gICAgY29uc3QgbG9naWNhbFB0ID0gdGhpcy50b0xvZ2ljYWwobmV3IFBvaW50KHgsIHkpKTtcbiAgICBjb25zdCB0ZXh0ID0gaG9yaXpvbnRhbCA/IE1hdGgucm91bmQobG9naWNhbFB0LngpLnRvU3RyaW5nKCkgOiBNYXRoLnJvdW5kKGxvZ2ljYWxQdC55KS50b1N0cmluZygpO1xuXG4gICAgLy8vLy8gY29sb3IgZm9yIGJhY2tncm91bmRcbiAgICAvLyB0aGlzLmNvbnRleHQuZmlsbFN0eWxlID0gJyMzMDMwMzAnO1xuICAgIC8vLy8vIGdldCB3aWR0aCBvZiB0ZXh0XG4gICAgY29uc3Qgd2lkdGggPSB0aGlzLmNvbnRleHQubWVhc3VyZVRleHQodGV4dCkud2lkdGg7XG4gICAgLy8vLy8gZHJhdyBiYWNrZ3JvdW5kIHJlY3QgYXNzdW1pbmcgaGVpZ2h0IG9mIGZvbnRcbiAgICAvLyB0aGlzLmNvbnRleHQuZmlsbFJlY3QoeCAtIHdpZHRoIC8gMi4wLCB5IC0gNiwgd2lkdGgsIDEyKTtcblxuICAgIHRoaXMuY29udGV4dC5maWxsU3R5bGUgPSAnI0ZGRkZGRjRBJztcbiAgICBpZiAoaG9yaXpvbnRhbCkge1xuICAgICAgdGhpcy5jb250ZXh0LnRleHRCYXNlbGluZSA9ICd0b3AnO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHRoaXMuY29udGV4dC50ZXh0QmFzZWxpbmUgPSAnbWlkZGxlJztcbiAgICB9XG5cbiAgICBpZiAoaG9yaXpvbnRhbCkge1xuICAgICAgdGhpcy5jb250ZXh0LnRleHRBbGlnbiA9ICdjZW50ZXInO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHRoaXMuY29udGV4dC50ZXh0QWxpZ24gPSAnc3RhcnQnO1xuICAgIH1cblxuICAgIHRoaXMuY29udGV4dC5maWxsVGV4dCh0ZXh0LCB4LCB5LCB3aWR0aCk7XG4gIH1cblxuICBkcmF3R3JpZCgpOiB2b2lkIHtcbiAgICBjb25zdCBjZW50ZXIgPSBuZXcgUG9pbnQodGhpcy5jZW50ZXIueCwgdGhpcy5jZW50ZXIueSk7XG4gICAgY2VudGVyLnggKz0gdGhpcy50b0RldmljZVNjYWxlKHRoaXMub2Zmc2V0WCk7XG4gICAgY2VudGVyLnkgLT0gdGhpcy50b0RldmljZVNjYWxlKHRoaXMub2Zmc2V0WSk7XG4gICAgbGV0IHN0ZXAgPSB0aGlzLnRvRGV2aWNlU2NhbGUoMTApO1xuXG4gICAgd2hpbGUgKHN0ZXAgPCA1KSB7XG4gICAgICBzdGVwIC89IDAuNDA7XG4gICAgfVxuXG4gICAgd2hpbGUgKHN0ZXAgPiAxNSkge1xuICAgICAgc3RlcCAqPSAwLjQwO1xuICAgIH1cblxuICAgIHRoaXMuY29udGV4dC5saW5lV2lkdGggPSAwLjI1O1xuICAgIHRoaXMuY29udGV4dC5zdHJva2VTdHlsZSA9ICcjM0MzQzNDJztcbiAgICAvLyB0aGlzLmNvbnRleHQuc3Ryb2tlU3R5bGUgPSBcIiNGRkZGRkZcIjtcbiAgICB0aGlzLmNvbnRleHQuc2V0TGluZURhc2goWzQsIDJdKTtcbiAgICB0aGlzLmNvbnRleHQuYmVnaW5QYXRoKCk7XG5cbiAgICBmb3IgKGxldCB4ID0gY2VudGVyLng7IHggPj0gMDsgeCAtPSBzdGVwKSB7XG4gICAgICB0aGlzLmNvbnRleHQubW92ZVRvKHgsIDApO1xuICAgICAgdGhpcy5jb250ZXh0LmxpbmVUbyh4LCB0aGlzLmNvbnRleHQuY2FudmFzLmhlaWdodCk7XG4gICAgfVxuXG4gICAgZm9yIChsZXQgeCA9IGNlbnRlci54ICsgc3RlcDsgeCA8PSB0aGlzLmNvbnRleHQuY2FudmFzLndpZHRoOyB4ICs9IHN0ZXApIHtcbiAgICAgIHRoaXMuY29udGV4dC5tb3ZlVG8oeCwgMCk7XG4gICAgICB0aGlzLmNvbnRleHQubGluZVRvKHgsIHRoaXMuY29udGV4dC5jYW52YXMuaGVpZ2h0KTtcbiAgICB9XG5cbiAgICBmb3IgKGxldCB5ID0gY2VudGVyLnk7IHkgPj0gMDsgeSAtPSBzdGVwKSB7XG4gICAgICB0aGlzLmNvbnRleHQubW92ZVRvKDAsIHkpO1xuICAgICAgdGhpcy5jb250ZXh0LmxpbmVUbyh0aGlzLmNvbnRleHQuY2FudmFzLndpZHRoLCB5KTtcbiAgICB9XG5cbiAgICBmb3IgKGxldCB5ID0gY2VudGVyLnkgKyBzdGVwOyB5IDw9IHRoaXMuY29udGV4dC5jYW52YXMuaGVpZ2h0OyB5ICs9IHN0ZXApIHtcbiAgICAgIHRoaXMuY29udGV4dC5tb3ZlVG8oMCwgeSk7XG4gICAgICB0aGlzLmNvbnRleHQubGluZVRvKHRoaXMuY29udGV4dC5jYW52YXMud2lkdGgsIHkpO1xuICAgIH1cblxuICAgIHRoaXMuY29udGV4dC5jbG9zZVBhdGgoKTtcbiAgICB0aGlzLmNvbnRleHQuc3Ryb2tlKCk7XG5cbiAgICBzdGVwID0gc3RlcCAqIDU7XG4gICAgdGhpcy5jb250ZXh0LmxpbmVXaWR0aCA9IDAuNTtcbiAgICB0aGlzLmNvbnRleHQuc3Ryb2tlU3R5bGUgPSAnIzNDM0MzQyc7XG4gICAgdGhpcy5jb250ZXh0LmJlZ2luUGF0aCgpO1xuXG4gICAgY29uc3QgaHcgPSAwLjU7XG4gICAgY29uc3QgdyA9IDE7XG5cbiAgICBmb3IgKGxldCB4ID0gY2VudGVyLng7IHggPj0gMDsgeCAtPSBzdGVwKSB7XG4gICAgICBmb3IgKGxldCB5ID0gY2VudGVyLnk7IHkgPj0gMDsgeSAtPSBzdGVwKSB7XG4gICAgICAgIHRoaXMuY29udGV4dC5zdHJva2VSZWN0KHggLSBodywgeSAtIGh3LCB3LCB3KTtcbiAgICAgIH1cblxuICAgICAgZm9yIChsZXQgeSA9IGNlbnRlci55ICsgc3RlcDsgeSA8PSB0aGlzLmNvbnRleHQuY2FudmFzLmhlaWdodDsgeSArPSBzdGVwKSB7XG4gICAgICAgIHRoaXMuY29udGV4dC5zdHJva2VSZWN0KHggLSBodywgeSAtIGh3LCB3LCB3KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKGxldCB4ID0gY2VudGVyLnggKyBzdGVwOyB4IDw9IHRoaXMuY29udGV4dC5jYW52YXMud2lkdGg7IHggKz0gc3RlcCkge1xuICAgICAgZm9yIChsZXQgeSA9IGNlbnRlci55OyB5ID49IDA7IHkgLT0gc3RlcCkge1xuICAgICAgICB0aGlzLmNvbnRleHQuc3Ryb2tlUmVjdCh4IC0gaHcsIHkgLSBodywgdywgdyk7XG4gICAgICB9XG5cbiAgICAgIGZvciAobGV0IHkgPSBjZW50ZXIueSArIHN0ZXA7IHkgPD0gdGhpcy5jb250ZXh0LmNhbnZhcy5oZWlnaHQ7IHkgKz0gc3RlcCkge1xuICAgICAgICB0aGlzLmNvbnRleHQuc3Ryb2tlUmVjdCh4IC0gaHcsIHkgLSBodywgdywgdyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5jb250ZXh0LmNsb3NlUGF0aCgpO1xuICAgIHRoaXMuY29udGV4dC5zdHJva2UoKTtcbiAgICB0aGlzLmNvbnRleHQuc2V0TGluZURhc2goW10pO1xuXG4gICAgLy8gdGhpcy5jb250ZXh0LnN0cm9rZVN0eWxlID0gXCIjMDAwMDAwXCI7XG4gICAgLy8gdGhpcy5jb250ZXh0LmxpbmVXaWR0aCA9IDE7XG4gICAgLy8gdGhpcy5jb250ZXh0LmJlZ2luUGF0aCgpO1xuXG4gICAgLy8gdGhpcy5jb250ZXh0LnN0cm9rZVJlY3QoY2VudGVyLnggLSAyLCBjZW50ZXIueSAtIDIsIDQsIDQpO1xuICAgIC8vIHRoaXMuY29udGV4dC5zdHJva2UoKTtcblxuICAgIGlmICh0aGlzLmRyYXdBeGlzZXMpIHtcbiAgICAgIHRoaXMuZHJhd0Nvb3JkaW5hdGVTeXN0ZW0oKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGRyYXdDb29yZGluYXRlU3lzdGVtKCk6IHZvaWQge1xuICAgIGNvbnN0IGNhbGNIZWlnaHQgPSB0aGlzLmhlaWdodCAtIHRoaXMuZGl2RWxlbWVudC5uYXRpdmVFbGVtZW50Lm9mZnNldFRvcDtcblxuICAgIHRoaXMuY29udGV4dC5saW5lV2lkdGggPSAxO1xuICAgIHRoaXMuY29udGV4dC5zdHJva2VTdHlsZSA9ICcjMDBCRkE1JztcbiAgICB0aGlzLmNvbnRleHQuYmVnaW5QYXRoKCk7XG4gICAgdGhpcy5jb250ZXh0Lm1vdmVUbyg0MCwgY2FsY0hlaWdodCAtIDQwKTtcbiAgICB0aGlzLmNvbnRleHQubGluZVRvKDQwLCBjYWxjSGVpZ2h0IC0gMTQwKTtcbiAgICB0aGlzLmNvbnRleHQubGluZVRvKDQ1LCBjYWxjSGVpZ2h0IC0gMTM1KTtcbiAgICB0aGlzLmNvbnRleHQubGluZVRvKDM1LCBjYWxjSGVpZ2h0IC0gMTM1KTtcbiAgICB0aGlzLmNvbnRleHQubGluZVRvKDQwLCBjYWxjSGVpZ2h0IC0gMTQwKTtcbiAgICB0aGlzLmNvbnRleHQuc3Ryb2tlKCk7XG5cbiAgICB0aGlzLmNvbnRleHQubGluZVdpZHRoID0gMTtcbiAgICB0aGlzLmNvbnRleHQuc3Ryb2tlU3R5bGUgPSAnIzAwOTFFQSc7XG4gICAgdGhpcy5jb250ZXh0LmJlZ2luUGF0aCgpO1xuICAgIHRoaXMuY29udGV4dC5tb3ZlVG8oNDAsIGNhbGNIZWlnaHQgLSA0MCk7XG4gICAgdGhpcy5jb250ZXh0LmxpbmVUbygxNDAsIGNhbGNIZWlnaHQgLSA0MCk7XG4gICAgdGhpcy5jb250ZXh0LmxpbmVUbygxMzUsIGNhbGNIZWlnaHQgLSAzNSk7XG4gICAgdGhpcy5jb250ZXh0LmxpbmVUbygxMzUsIGNhbGNIZWlnaHQgLSA0NSk7XG4gICAgdGhpcy5jb250ZXh0LmxpbmVUbygxNDAsIGNhbGNIZWlnaHQgLSA0MCk7XG4gICAgdGhpcy5jb250ZXh0LnN0cm9rZSgpO1xuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcignbW91c2Vkb3duJywgWyckZXZlbnQnXSlcbiAgb25Nb3VzZWRvd24oZXZlbnQpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5pc1Bhbikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBwdCA9IG5ldyBQb2ludChldmVudC5jbGllbnRYLCBldmVudC5jbGllbnRZIC0gdGhpcy5kaXZFbGVtZW50Lm5hdGl2ZUVsZW1lbnQub2Zmc2V0VG9wKTtcbiAgICB0aGlzLnN0YXRlRXZlbnQgPSBldmVudDtcbiAgICBjb25zdCBzZCA9IG5ldyBTdXJmYWNlRGF0YShwdCwgdGhpcy50b0xvZ2ljYWwocHQpLCB0aGlzLCBldmVudCwgdGhpcy5zdGF0ZUV2ZW50KTtcbiAgICB0aGlzLmRvd24uZW1pdChzZCk7XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCdtb3VzZW1vdmUnLCBbJyRldmVudCddKVxuICBvbk1vdXNlbW92ZShldmVudDogTW91c2VFdmVudCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmlzUGFuKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IHB0ID0gbmV3IFBvaW50KGV2ZW50LmNsaWVudFgsIGV2ZW50LmNsaWVudFkgLSB0aGlzLmRpdkVsZW1lbnQubmF0aXZlRWxlbWVudC5vZmZzZXRUb3ApO1xuICAgIGNvbnN0IHNkID0gbmV3IFN1cmZhY2VEYXRhKHB0LCB0aGlzLnRvTG9naWNhbChwdCksIHRoaXMsIGV2ZW50LCB0aGlzLnN0YXRlRXZlbnQpO1xuICAgIHRoaXMucG9pbnRlclBvc2l0aW9uID0gc2QubW9kZWxQb2ludDtcbiAgICB0aGlzLm1vdmUuZW1pdChzZCk7XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCdtb3VzZXVwJywgWyckZXZlbnQnXSlcbiAgb25Nb3VzZXVwKGV2ZW50OiBNb3VzZUV2ZW50KTogdm9pZCB7XG4gICAgaWYgKHRoaXMuaXNQYW4pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgcHQgPSBuZXcgUG9pbnQoZXZlbnQuY2xpZW50WCwgZXZlbnQuY2xpZW50WSAtIHRoaXMuZGl2RWxlbWVudC5uYXRpdmVFbGVtZW50Lm9mZnNldFRvcCk7XG4gICAgY29uc3Qgc2QgPSBuZXcgU3VyZmFjZURhdGEocHQsIHRoaXMudG9Mb2dpY2FsKHB0KSwgdGhpcywgZXZlbnQsIHRoaXMuc3RhdGVFdmVudCk7XG4gICAgdGhpcy51cC5lbWl0KHNkKTtcbiAgICB0aGlzLnN0YXRlRXZlbnQgPSBldmVudDtcbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ3BhbnN0YXJ0JywgWyckZXZlbnQnXSlcbiAgcHJvdGVjdGVkIG9uUGFuU3RhcnQoZXZlbnQpOiB2b2lkIHtcbiAgICBpZiAoZXZlbnQucG9pbnRlclR5cGUgPT09ICd0b3VjaCcpIHtcbiAgICAgIHRoaXMuaXNQYW4gPSB0cnVlO1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIHRoaXMuc3RhdGVFdmVudCA9IGV2ZW50O1xuICAgICAgY29uc3QgcHQgPSBuZXcgUG9pbnQoZXZlbnQuY2VudGVyLngsIGV2ZW50LmNlbnRlci55IC0gdGhpcy5kaXZFbGVtZW50Lm5hdGl2ZUVsZW1lbnQub2Zmc2V0VG9wKTtcbiAgICAgIGNvbnN0IHNkID0gbmV3IFN1cmZhY2VEYXRhKHB0LCB0aGlzLnRvTG9naWNhbChwdCksIHRoaXMsIGV2ZW50LCB0aGlzLnN0YXRlRXZlbnQpO1xuICAgICAgdGhpcy5kb3duLmVtaXQoc2QpO1xuICAgIH1cbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ3Bhbm1vdmUnLCBbJyRldmVudCddKVxuICBwcm90ZWN0ZWQgb25QYW5Nb3ZlKGV2ZW50KTogdm9pZCB7XG4gICAgaWYgKGV2ZW50LnBvaW50ZXJUeXBlID09PSAndG91Y2gnKSB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgY29uc3QgcHQgPSBuZXcgUG9pbnQoZXZlbnQuY2VudGVyLngsIGV2ZW50LmNlbnRlci55IC0gdGhpcy5kaXZFbGVtZW50Lm5hdGl2ZUVsZW1lbnQub2Zmc2V0VG9wKTtcbiAgICAgIGNvbnN0IHNkID0gbmV3IFN1cmZhY2VEYXRhKHB0LCB0aGlzLnRvTG9naWNhbChwdCksIHRoaXMsIGV2ZW50LCB0aGlzLnN0YXRlRXZlbnQpO1xuICAgICAgdGhpcy5tb3ZlLmVtaXQoc2QpO1xuICAgIH1cbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ3BhbmVuZCcsIFsnJGV2ZW50J10pXG4gIHByb3RlY3RlZCBvblBhbkVuZChldmVudCk6IHZvaWQge1xuICAgIGlmIChldmVudC5wb2ludGVyVHlwZSA9PT0gJ3RvdWNoJykge1xuICAgICAgdGhpcy5pc1BhbiA9IGZhbHNlO1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGNvbnN0IHB0ID0gbmV3IFBvaW50KGV2ZW50LmNlbnRlci54LCBldmVudC5jZW50ZXIueSAtIHRoaXMuZGl2RWxlbWVudC5uYXRpdmVFbGVtZW50Lm9mZnNldFRvcCk7XG4gICAgICBjb25zdCBzZCA9IG5ldyBTdXJmYWNlRGF0YShwdCwgdGhpcy50b0xvZ2ljYWwocHQpLCB0aGlzLCBldmVudCwgdGhpcy5zdGF0ZUV2ZW50KTtcbiAgICAgIHRoaXMudXAuZW1pdChzZCk7XG4gICAgICB0aGlzLnN0YXRlRXZlbnQgPSBldmVudDtcbiAgICB9XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCdtb3VzZXdoZWVsJywgWyckZXZlbnQnXSlcbiAgb25Nb3VzZXdoZWVsKGV2ZW50KTogdm9pZCB7XG4gICAgY29uc3QgcHQgPSBuZXcgUG9pbnQoZXZlbnQuY2xpZW50WCwgZXZlbnQuY2xpZW50WSAtIHRoaXMuZGl2RWxlbWVudC5uYXRpdmVFbGVtZW50Lm9mZnNldFRvcCk7XG4gICAgY29uc3Qgc2QgPSBuZXcgU3VyZmFjZURhdGEocHQsIHRoaXMudG9Mb2dpY2FsKHB0KSwgdGhpcywgZXZlbnQsIHRoaXMuc3RhdGVFdmVudCk7XG4gICAgdGhpcy53aGVlbFJvdGF0ZS5lbWl0KHNkKTtcbiAgfVxufVxuIl19