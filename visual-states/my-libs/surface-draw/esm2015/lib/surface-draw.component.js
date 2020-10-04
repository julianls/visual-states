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
        if (event.touches && event.touches.length > 0) {
            this.isPan = true;
            this.stateEvent = event;
            event.preventDefault();
            const touch = event.touches[0];
            const pt = new Point(touch.clientX, touch.clientY - this.divElement.nativeElement.offsetTop);
            const sd = new SurfaceData(pt, this.toLogical(pt), this, event, this.stateEvent);
            this.down.emit(sd);
        }
    }
    onPanMove(event) {
        if (event.touches && event.touches.length > 0) {
            event.preventDefault();
            const touch = event.touches[0];
            const pt = new Point(touch.clientX, touch.clientY - this.divElement.nativeElement.offsetTop);
            const sd = new SurfaceData(pt, this.toLogical(pt), this, event, this.stateEvent);
            this.move.emit(sd);
        }
    }
    onPanEnd(event) {
        if (event.changedTouches && event.changedTouches.length > 0) {
            this.isPan = false;
            event.preventDefault();
            const touch = event.changedTouches[0];
            const pt = new Point(touch.clientX, touch.clientY - this.divElement.nativeElement.offsetTop);
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
        i0.ɵɵlistener("mousedown", function SurfaceDrawComponent_mousedown_HostBindingHandler($event) { return ctx.onMousedown($event); })("mousemove", function SurfaceDrawComponent_mousemove_HostBindingHandler($event) { return ctx.onMousemove($event); })("mouseup", function SurfaceDrawComponent_mouseup_HostBindingHandler($event) { return ctx.onMouseup($event); })("touchstart", function SurfaceDrawComponent_touchstart_HostBindingHandler($event) { return ctx.onPanStart($event); })("touchmove", function SurfaceDrawComponent_touchmove_HostBindingHandler($event) { return ctx.onPanMove($event); })("touchend", function SurfaceDrawComponent_touchend_HostBindingHandler($event) { return ctx.onPanEnd($event); })("mousewheel", function SurfaceDrawComponent_mousewheel_HostBindingHandler($event) { return ctx.onMousewheel($event); });
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
            args: ['touchstart', ['$event']]
        }], onPanMove: [{
            type: HostListener,
            args: ['touchmove', ['$event']]
        }], onPanEnd: [{
            type: HostListener,
            args: ['touchend', ['$event']]
        }], onMousewheel: [{
            type: HostListener,
            args: ['mousewheel', ['$event']]
        }] }); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3VyZmFjZS1kcmF3LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJDOi93b3JrL0FwcGFyZWxTdHVkaW9Qcm9qZWN0L2xpYi1hbmd1bGFyL3N1cmZhY2UtZHJhdy13b3Jrc3BhY2UvcHJvamVjdHMvc3VyZmFjZS1kcmF3L3NyYy8iLCJzb3VyY2VzIjpbImxpYi9zdXJmYWNlLWRyYXcuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQVUsU0FBUyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUF3QyxZQUFZLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFOUksT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQzlDLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQzs7OztBQXNCN0MsTUFBTSxPQUFPLG9CQUFvQjtJQXlDL0I7UUFqQ1EsZUFBVSxHQUFHLENBQUMsQ0FBQztRQUNmLGlCQUFZLEdBQUcsQ0FBQyxDQUFDO1FBQ2pCLGlCQUFZLEdBQUcsQ0FBQyxDQUFDO1FBQ2pCLGVBQVUsR0FBRyxDQUFDLENBQUM7UUFDZixnQkFBVyxHQUFHLENBQUMsQ0FBQztRQUNoQixnQkFBVyxHQUFHLEtBQUssQ0FBQztRQUVuQixlQUFVLEdBQUcsS0FBSyxDQUFDO1FBRWxCLGdCQUFXLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUNqQyxrQkFBYSxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7UUFDbkMsa0JBQWEsR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO1FBQ25DLGdCQUFXLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUNqQyxpQkFBWSxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7UUFFcEMsV0FBTSxHQUFVLElBQUksS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNoQyxvQkFBZSxHQUFVLElBQUksS0FBSyxDQUFDLENBQUMsRUFBRSxD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QUFXO2tCQUFwQixNQUFNO1lBUUgsS0FBSztrQkFEUixLQUFLO1lBYUYsT0FBTztrQkFEVixLQUFLO1lBYUYsT0FBTztrQkFEVixLQUFLO1lBaUJGLEtBQUs7a0JBRFIsS0FBSztZQWFGLE1BQU07a0JBRFQsS0FBSztZQVNGLE1BQU07a0JBRFQsS0FBSztZQTBlTixXQUFXO2tCQURWLFlBQVk7bUJBQUMsV0FBVyxFQUFFLENBQUMsUUFBUSxDQUFDO1lBWXJDLFdBQVc7a0JBRFYsWUFBWTttQkFBQyxXQUFXLEVBQUUsQ0FBQyxRQUFRLENBQUM7WUFZckMsU0FBUztrQkFEUixZQUFZO21CQUFDLFNBQVMsRUFBRSxDQUFDLFFBQVEsQ0FBQztZQVl6QixVQUFVO2tCQURuQixZQUFZO21CQUFDLFlBQVksRUFBRSxDQUFDLFFBQVEsQ0FBQztZQWM1QixTQUFTO2tCQURsQixZQUFZO21CQUFDLFdBQVcsRUFBRSxDQUFDLFFBQVEsQ0FBQztZQVkzQixRQUFRO2tCQURqQixZQUFZO21CQUFDLFVBQVUsRUFBRSxDQUFDLFFBQVEsQ0FBQztZQWNwQyxZQUFZO2tCQURYLFlBQVk7bUJBQUMsWUFBWSxFQUFFLENBQUMsUUFBUSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQsIFZpZXdDaGlsZCwgSW5wdXQsIE91dHB1dCwgRXZlbnRFbWl0dGVyLCBFbGVtZW50UmVmLCBBZnRlclZpZXdJbml0LCBPbkNoYW5nZXMsIEhvc3RMaXN0ZW5lciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgSVN1cmZhY2VEcmF3LCBJRHJhd2FibGUsIElQb2ludCB9IGZyb20gJ215LWxpYnMvYmFzZS1kcmF3JztcbmltcG9ydCB7IFBvaW50IH0gZnJvbSAnbXktbGlicy9iYXNlLWdlb21ldHJ5JztcbmltcG9ydCB7IFN1cmZhY2VEYXRhIH0gZnJvbSAnLi9zdXJmYWNlLWRhdGEnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdsaWItc3VyZmFjZS1kcmF3JyxcbiAgdGVtcGxhdGU6IGBcbiAgPGRpdiAjZGl2RWxlbWVudCBjbGFzcz1cImRpdi1yb290XCI+XG4gICAgPGNhbnZhcyAjbXlDYW52YXMgY2xhc3M9XCJjYW52YXMtbWFpblwiPlxuICAgIDwvY2FudmFzPlxuICA8L2Rpdj5cbiAgYCxcbiAgc3R5bGVzOiBbYFxuICAuY2FudmFzLW1haW4ge1xuICAgIHRvdWNoLWFjdGlvbjogbm9uZSAhaW1wb3J0YW50O1xuICB9XG5cbiAgLmRpdi1yb290IHtcbiAgICBwb3NpdGlvbjogZml4ZWQ7XG4gICAgd2lkdGg6IDEwMCU7XG4gICAgaGVpZ2h0OiAxMDAlO1xuICB9XG4gIGBdXG59KVxuZXhwb3J0IGNsYXNzIFN1cmZhY2VEcmF3Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMsIEFmdGVyVmlld0luaXQsIElTdXJmYWNlRHJhdyB7XG4gIEBWaWV3Q2hpbGQoJ215Q2FudmFzJywgeyBzdGF0aWM6IHRydWUgfSkgY2FudmFzUmVmOiBFbGVtZW50UmVmO1xuICBAVmlld0NoaWxkKCdkaXZFbGVtZW50JywgeyBzdGF0aWM6IHRydWUgfSkgZGl2RWxlbWVudDogYW55O1xuXG4gIEBJbnB1dCgpIGRyYXdJdGVtczogSURyYXdhYmxlW107XG5cbiAgcHJpdmF0ZSBvZmZzY3JlZW5DYW52YXM6IEhUTUxDYW52YXNFbGVtZW50O1xuXG4gIHByaXZhdGUgc2NhbGVWYWx1ZSA9IDE7XG4gIHByaXZhdGUgb2Zmc2V0WFZhbHVlID0gMDtcbiAgcHJpdmF0ZSBvZmZzZXRZVmFsdWUgPSAwO1xuICBwcml2YXRlIHdpZHRoVmFsdWUgPSAwO1xuICBwcml2YXRlIGhlaWdodFZhbHVlID0gMDtcbiAgcHJpdmF0ZSBzd2l0Y2hWYWx1ZSA9IGZhbHNlO1xuXG4gIEBJbnB1dCgpIGRyYXdBeGlzZXMgPSBmYWxzZTtcblxuICBAT3V0cHV0KCkgc2NhbGVDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoKSBvZmZzZXRYQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCkgb2Zmc2V0WUNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgQE91dHB1dCgpIHdpZHRoQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCkgaGVpZ2h0Q2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gIHByaXZhdGUgY2VudGVyOiBQb2ludCA9IG5ldyBQb2ludCgwLCAwKTtcbiAgcHJpdmF0ZSBwb2ludGVyUG9zaXRpb246IFBvaW50ID0gbmV3IFBvaW50KDAsIDApO1xuXG4gIHByaXZhdGUgY29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xuICBwcml2YXRlIGNhbnZhc1ZhbGlkID0gZmFsc2U7XG4gIC8vIHByaXZhdGUgbGFzdFJlZnJlc2hIYW5kbGU6IG51bWJlcjtcbiAgLy8gcHJpdmF0ZSBjYW5jZWxSZWZyZXNoQ291bnRlcjogbnVtYmVyID0gMDtcblxuICBwcml2YXRlIGlzUGFuID0gZmFsc2U7XG5cbiAgQE91dHB1dCgpIGRvd246IEV2ZW50RW1pdHRlcjxTdXJmYWNlRGF0YT4gPSBuZXcgRXZlbnRFbWl0dGVyPFN1cmZhY2VEYXRhPigpO1xuICBAT3V0cHV0KCkgbW92ZTogRXZlbnRFbWl0dGVyPFN1cmZhY2VEYXRhPiA9IG5ldyBFdmVudEVtaXR0ZXI8U3VyZmFjZURhdGE+KCk7XG4gIEBPdXRwdXQoKSB1cDogRXZlbnRFbWl0dGVyPFN1cmZhY2VEYXRhPiA9IG5ldyBFdmVudEVtaXR0ZXI8U3VyZmFjZURhdGE+KCk7XG4gIEBPdXRwdXQoKSB3aGVlbFJvdGF0ZTogRXZlbnRFbWl0dGVyPFN1cmZhY2VEYXRhPiA9IG5ldyBFdmVudEVtaXR0ZXI8U3VyZmFjZURhdGE+KCk7XG4gIC8vIEBPdXRwdXQoKSBjbGljazogRXZlbnRFbWl0dGVyPFBvaW50PiA9IG5ldyBFdmVudEVtaXR0ZXI8UG9pbnQ+KCk7XG5cbiAgcHJpdmF0ZSBzdGF0ZUV2ZW50OiBhbnkgPSBudWxsO1xuXG4gIGNvbnN0cnVjdG9yKCkgeyB9XG5cbiAgQElucHV0KClcbiAgc2V0IHNjYWxlKHZhbCkge1xuICAgIGlmICh0aGlzLnNjYWxlVmFsdWUgIT09IHZhbCkge1xuICAgICAgdGhpcy5zY2FsZVZhbHVlID0gdmFsO1xuICAgICAgdGhpcy5zY2FsZUNoYW5nZS5lbWl0KHRoaXMuc2NhbGVWYWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgZ2V0IHNjYWxlKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuc2NhbGVWYWx1ZTtcbiAgfVxuXG4gIEBJbnB1dCgpXG4gIHNldCBvZmZzZXRYKHZhbCkge1xuICAgIGlmICh0aGlzLm9mZnNldFhWYWx1ZSAhPT0gdmFsKSB7XG4gICAgICB0aGlzLm9mZnNldFhWYWx1ZSA9IHZhbDtcbiAgICAgIHRoaXMub2Zmc2V0WENoYW5nZS5lbWl0KHRoaXMub2Zmc2V0WFZhbHVlKTtcbiAgICB9XG4gIH1cblxuICBnZXQgb2Zmc2V0WCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLm9mZnNldFhWYWx1ZTtcbiAgfVxuXG4gIEBJbnB1dCgpXG4gIHNldCBvZmZzZXRZKHZhbCkge1xuICAgIGlmICh0aGlzLm9mZnNldFhWYWx1ZSAhPT0gdmFsKSB7XG4gICAgICB0aGlzLm9mZnNldFlWYWx1ZSA9IHZhbDtcbiAgICAgIHRoaXMub2Zmc2V0WUNoYW5nZS5lbWl0KHRoaXMub2Zmc2V0WVZhbHVlKTtcbiAgICB9XG4gIH1cblxuICBnZXQgb2Zmc2V0WSgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLm9mZnNldFlWYWx1ZTtcbiAgfVxuXG4gIGdldCB3aWR0aCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLndpZHRoVmFsdWU7XG4gIH1cblxuICBASW5wdXQoKVxuICBzZXQgd2lkdGgodmFsKSB7XG4gICAgaWYgKHRoaXMud2lkdGhWYWx1ZSAhPT0gdmFsKSB7XG4gICAgICB0aGlzLndpZHRoVmFsdWUgPSB2YWw7XG4gICAgICB0aGlzLndpZHRoQ2hhbmdlLmVtaXQodGhpcy53aWR0aFZhbHVlKTtcbiAgICB9XG4gIH1cblxuICBnZXQgaGVpZ2h0KCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuaGVpZ2h0VmFsdWU7XG4gIH1cblxuICBASW5wdXQoKVxuICBzZXQgaGVpZ2h0KHZhbCkge1xuICAgIGlmICh0aGlzLmhlaWdodFZhbHVlICE9PSB2YWwpIHtcbiAgICAgIHRoaXMuaGVpZ2h0VmFsdWUgPSB2YWw7XG4gICAgICB0aGlzLmhlaWdodENoYW5nZS5lbWl0KHRoaXMuaGVpZ2h0VmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIEBJbnB1dCgpXG4gIHNldCBzd2l0Y2godmFsKSB7XG4gICAgaWYgKHRoaXMuc3dpdGNoVmFsdWUgIT09IHZhbCkge1xuICAgICAgdGhpcy5zd2l0Y2hWYWx1ZSA9IHZhbDtcbiAgICAgIHRoaXMuaW52YWxpZGF0ZURyYXdpbmcoKTtcbiAgICB9XG4gIH1cblxuICBnZXQgc3dpdGNoKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnN3aXRjaFZhbHVlO1xuICB9XG5cbiAgZ2V0IG1vdXNlUG9zaXRpb24oKTogSVBvaW50IHtcbiAgICByZXR1cm4gdGhpcy5wb2ludGVyUG9zaXRpb247XG4gIH1cblxuICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLm9mZnNjcmVlbkNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuICAgIHRoaXMuY2FudmFzVmFsaWQgPSB0cnVlO1xuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCk6IHZvaWQge1xuICAgIC8vIHRoaXMuY29udGV4dCA9IHRoaXMuY2FudmFzUmVmLm5hdGl2ZUVsZW1lbnQuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICB0aGlzLmNvbnRleHQgPSB0aGlzLm9mZnNjcmVlbkNhbnZhcy5nZXRDb250ZXh0KCcyZCcsIHsgYWxwaGE6IGZhbHNlIH0pO1xuICAgIHdpbmRvdy5vbnJlc2l6ZSA9IHRoaXMucmVzaXplQ2FudmFzLmJpbmQodGhpcyk7XG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHRoaXMucmVzaXplQ2FudmFzKHRoaXMuZGl2RWxlbWVudCkpO1xuICB9XG5cbiAgcHJpdmF0ZSByZXNpemVDYW52YXMoXzogVUlFdmVudCk6IHZvaWQge1xuICAgIGNvbnN0IGVsOiBIVE1MRGl2RWxlbWVudCA9IHRoaXMuZGl2RWxlbWVudC5uYXRpdmVFbGVtZW50O1xuICAgIHRoaXMud2lkdGggPSBlbC5jbGllbnRXaWR0aDtcbiAgICB0aGlzLmhlaWdodCA9IGVsLmNsaWVudEhlaWdodDtcbiAgICB0aGlzLm9mZnNjcmVlbkNhbnZhcy53aWR0aCA9IHRoaXMud2lkdGg7XG4gICAgdGhpcy5vZmZzY3JlZW5DYW52YXMuaGVpZ2h0ID0gdGhpcy5oZWlnaHQ7XG4gICAgdGhpcy5jYW52YXNSZWYubmF0aXZlRWxlbWVudC53aWR0aCA9IGVsLmNsaWVudFdpZHRoO1xuICAgIHRoaXMuY2FudmFzUmVmLm5hdGl2ZUVsZW1lbnQuaGVpZ2h0ID0gZWwuY2xpZW50SGVpZ2h0O1xuICAgIHRoaXMuaW52YWxpZGF0ZURyYXdpbmcoKTtcbiAgfVxuXG5cbiAgbmdPbkNoYW5nZXMoKTogdm9pZCB7XG4gICAgLy8gdGhpcy5jb250ZXh0ID0gdGhpcy5jYW52YXNSZWYubmF0aXZlRWxlbWVudC5nZXRDb250ZXh0KCcyZCcpO1xuICAgIGlmICh0aGlzLm9mZnNjcmVlbkNhbnZhcykge1xuICAgICAgdGhpcy5jb250ZXh0ID0gdGhpcy5vZmZzY3JlZW5DYW52YXMuZ2V0Q29udGV4dCgnMmQnLCB7IGFscGhhOiBmYWxzZSB9KTtcbiAgICAgIHRoaXMuaW52YWxpZGF0ZURyYXdpbmcoKTtcbiAgICB9XG4gIH1cblxuICBpbnZhbGlkYXRlRHJhd2luZygpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5jYW52YXNWYWxpZCkge1xuICAgICAgdGhpcy5jYW52YXNWYWxpZCA9IGZhbHNlO1xuICAgICAgLy8gdGhpcy5jYW5jZWxSZWZyZXNoQ291bnRlcisrO1xuICAgICAgLy8gaWYgKHRoaXMuY2FuY2VsUmVmcmVzaENvdW50ZXIgPCAxMClcbiAgICAgIC8vICBjYW5jZWxBbmltYXRpb25GcmFtZSh0aGlzLmxhc3RSZWZyZXNoSGFuZGxlKTtcbiAgICAgIC8vIGVsc2VcbiAgICAgIC8vICB0aGlzLmNhbmNlbFJlZnJlc2hDb3VudGVyID0gMDtcbiAgICAgIC8vIHRoaXMubGFzdFJlZnJlc2hIYW5kbGUgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4gdGhpcy5kcmF3T2Zmc2NyZWVuKCkpO1xuICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHRoaXMuZHJhd09mZnNjcmVlbigpKTtcbiAgICB9XG4gIH1cblxuICBsaW5lKHgxOiBudW1iZXIsIHkxOiBudW1iZXIsIHgyOiBudW1iZXIsIHkyOiBudW1iZXIsIHN0cm9rZVN0eWxlOiBzdHJpbmcgPSAnI0YzRTVGNScpOiB2b2lkIHtcbiAgICB0aGlzLmNvbnRleHQuc3Ryb2tlU3R5bGUgPSBzdHJva2VTdHlsZTtcbiAgICB0aGlzLmNvbnRleHQuYmVnaW5QYXRoKCk7XG4gICAgdGhpcy5jb250ZXh0Lm1vdmVUbyh0aGlzLnRvRGV2aWNlWCh4MSksIHRoaXMudG9EZXZpY2VZKHkxKSk7XG4gICAgdGhpcy5jb250ZXh0LmxpbmVUbyh0aGlzLnRvRGV2aWNlWCh4MiksIHRoaXMudG9EZXZpY2VZKHkyKSk7XG4gICAgdGhpcy5jb250ZXh0LnN0cm9rZSgpO1xuICB9XG5cbiAgcG9seWxpbmUocG9pbnRzOiBJUG9pbnRbXSwgc3Ryb2tlU3R5bGU6IHN0cmluZyA9ICcjRjNFNUY1Jyk6IHZvaWQge1xuICAgIHRoaXMuY29udGV4dC5zdHJva2VTdHlsZSA9IHN0cm9rZVN0eWxlO1xuICAgIHRoaXMuY29udGV4dC5iZWdpblBhdGgoKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBvaW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKGkgPT09IDApIHtcbiAgICAgICAgdGhpcy5jb250ZXh0Lm1vdmVUbyh0aGlzLnRvRGV2aWNlWChwb2ludHNbaV0ueCksIHRoaXMudG9EZXZpY2VZKHBvaW50c1tpXS55KSk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgdGhpcy5jb250ZXh0LmxpbmVUbyh0aGlzLnRvRGV2aWNlWChwb2ludHNbaV0ueCksIHRoaXMudG9EZXZpY2VZKHBvaW50c1tpXS55KSk7XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuY29udGV4dC5zdHJva2UoKTtcbiAgfVxuXG4gIHBvbHlnb24ocG9pbnRzOiBJUG9pbnRbXSwgc3Ryb2tlU3R5bGU6IHN0cmluZyA9ICcjRjNFNUY1JywgZmlsbFN0eWxlPzogc3RyaW5nKTogdm9pZCB7XG4gICAgdGhpcy5jb250ZXh0LnN0cm9rZVN0eWxlID0gc3Ryb2tlU3R5bGU7XG4gICAgdGhpcy5jb250ZXh0LmJlZ2luUGF0aCgpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcG9pbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoaSA9PT0gMCkge1xuICAgICAgICB0aGlzLmNvbnRleHQubW92ZVRvKHRoaXMudG9EZXZpY2VYKHBvaW50c1tpXS54KSwgdGhpcy50b0RldmljZVkocG9pbnRzW2ldLnkpKTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICB0aGlzLmNvbnRleHQubGluZVRvKHRoaXMudG9EZXZpY2VYKHBvaW50c1tpXS54KSwgdGhpcy50b0RldmljZVkocG9pbnRzW2ldLnkpKTtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5jb250ZXh0LmNsb3NlUGF0aCgpO1xuXG4gICAgaWYgKGZpbGxTdHlsZSkge1xuICAgICAgY29uc3Qgb2xkRmlsbCA9IHRoaXMuY29udGV4dC5maWxsU3R5bGU7XG4gICAgICB0aGlzLmNvbnRleHQuZmlsbFN0eWxlID0gZmlsbFN0eWxlO1xuICAgICAgdGhpcy5jb250ZXh0LmZpbGwoKTtcbiAgICAgIHRoaXMuY29udGV4dC5maWxsU3R5bGUgPSBvbGRGaWxsO1xuICAgIH1cblxuICAgIHRoaXMuY29udGV4dC5zdHJva2UoKTtcbiAgfVxuXG4gIGJlemllckN1cnZlKHgxOiBudW1iZXIsIHkxOiBudW1iZXIsIGNwMXg6IG51bWJlciwgY3AxeTogbnVtYmVyLCBjcDJ4OiBudW1iZXIsIGNwMnk6IG51bWJlciwgeDI6IG51bWJlciwgeTI6IG51bWJlciwgc3Ryb2tlU3R5bGU6IHN0cmluZyA9ICcjRjNFNUY1Jyk6IHZvaWQge1xuICAgIHRoaXMuY29udGV4dC5zdHJva2VTdHlsZSA9IHN0cm9rZVN0eWxlO1xuICAgIHRoaXMuY29udGV4dC5iZWdpblBhdGgoKTtcbiAgICB0aGlzLmNvbnRleHQubW92ZVRvKHRoaXMudG9EZXZpY2VYKHgxKSwgdGhpcy50b0RldmljZVkoeTEpKTtcbiAgICB0aGlzLmNvbnRleHQuYmV6aWVyQ3VydmVUbyh0aGlzLnRvRGV2aWNlWChjcDF4KSwgdGhpcy50b0RldmljZVkoY3AxeSksXG4gICAgICB0aGlzLnRvRGV2aWNlWChjcDJ4KSwgdGhpcy50b0RldmljZVkoY3AyeSksIHRoaXMudG9EZXZpY2VYKHgyKSwgdGhpcy50b0RldmljZVkoeTIpKTtcbiAgICB0aGlzLmNvbnRleHQuc3Ryb2tlKCk7XG4gIH1cblxuICByZWN0KHgxOiBudW1iZXIsIHkxOiBudW1iZXIsIHc6IG51bWJlciwgaDogbnVtYmVyLCBzdHJva2VTdHlsZTogc3RyaW5nID0gJyNGM0U1RjUnKTogdm9pZCB7XG4gICAgdGhpcy5jb250ZXh0LnN0cm9rZVN0eWxlID0gc3Ryb2tlU3R5bGU7XG4gICAgY29uc3Qgd2lkdGggPSB0aGlzLnRvRGV2aWNlU2NhbGUodyk7XG4gICAgY29uc3QgaGVpZ2h0ID0gdGhpcy50b0RldmljZVNjYWxlKGgpO1xuICAgIHRoaXMuY29udGV4dC5zdHJva2VSZWN0KHRoaXMudG9EZXZpY2VYKHgxKSwgdGhpcy50b0RldmljZVkoeTEpIC0gaGVpZ2h0LCB3aWR0aCwgaGVpZ2h0KTtcbiAgfVxuXG4gIHRleHQodGV4dDogc3RyaW5nLCB4OiBudW1iZXIsIHk6IG51bWJlciwgZm9udDogc3RyaW5nID0gbnVsbCwgc3Ryb2tlU3R5bGU6IHN0cmluZyA9ICcjRjNFNUY1Jyk6IHZvaWQge1xuICAgIHggPSB0aGlzLnRvRGV2aWNlWCh4KTtcbiAgICB5ID0gdGhpcy50b0RldmljZVkoeSk7XG4gICAgLy8vIGNvbG9yIGZvciBiYWNrZ3JvdW5kXG4gICAgdGhpcy5jb250ZXh0LmZpbGxTdHlsZSA9ICcjMzAzMDMwJztcbiAgICAvLy8gZ2V0IHdpZHRoIG9mIHRleHRcbiAgICBjb25zdCBvbGRGb250ID0gdGhpcy5jb250ZXh0LmZvbnQ7XG4gICAgaWYgKGZvbnQpIHtcbiAgICAgIHRoaXMuY29udGV4dC5mb250ID0gZm9udDtcbiAgICB9XG4gICAgY29uc3Qgd2lkdGggPSB0aGlzLmNvbnRleHQubWVhc3VyZVRleHQodGV4dCkud2lkdGg7XG4gICAgLy8vIGRyYXcgYmFja2dyb3VuZCByZWN0IGFzc3VtaW5nIGhlaWdodCBvZiBmb250XG4gICAgdGhpcy5jb250ZXh0LmZpbGxSZWN0KHggLSB3aWR0aCAvIDIuMCwgeSAtIDYsIHdpZHRoLCAxMik7XG5cbiAgICB0aGlzLmNvbnRleHQuZmlsbFN0eWxlID0gc3Ryb2tlU3R5bGU7XG4gICAgdGhpcy5jb250ZXh0LnRleHRCYXNlbGluZSA9ICdtaWRkbGUnO1xuICAgIHRoaXMuY29udGV4dC50ZXh0QWxpZ24gPSAnY2VudGVyJztcbiAgICB0aGlzLmNvbnRleHQuZmlsbFRleHQodGV4dCwgeCwgeSwgd2lkdGgpO1xuICAgIGlmIChmb250KSB7XG4gICAgICB0aGlzLmNvbnRleHQuZm9udCA9IG9sZEZvbnQ7XG4gICAgfVxuICB9XG5cbiAgaW1hZ2UoaW1nOiBJbWFnZUJpdG1hcCwgeDogbnVtYmVyLCB5OiBudW1iZXIsIHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyLCBzY2FsZTogbnVtYmVyKTogdm9pZCB7XG4gICAgeCA9IHRoaXMudG9EZXZpY2VYKHgpO1xuICAgIHkgPSB0aGlzLnRvRGV2aWNlWSh5KTtcbiAgICB3aWR0aCA9IHRoaXMudG9EZXZpY2VTY2FsZSh3aWR0aCAqIHNjYWxlKTtcbiAgICBoZWlnaHQgPSB0aGlzLnRvRGV2aWNlU2NhbGUoaGVpZ2h0ICogc2NhbGUpO1xuXG4gICAgdGhpcy5jb250ZXh0LmRyYXdJbWFnZShpbWcsIDAsIDAsIGltZy53aWR0aCwgaW1nLmhlaWdodCwgeCwgeSAtIGhlaWdodCwgd2lkdGgsIGhlaWdodCk7XG4gIH1cblxuICBmcm9tRGV2aWNlU2NhbGUodmFsOiBudW1iZXIpOiBudW1iZXIge1xuICAgIHJldHVybiB2YWwgLyB0aGlzLnNjYWxlO1xuICB9XG5cbiAgdG9EZXZpY2VTY2FsZSh2YWw6IG51bWJlcik6IG51bWJlciB7XG4gICAgcmV0dXJuIHZhbCAqIHRoaXMuc2NhbGU7XG4gIH1cblxuICB0b0RldmljZVgodmFsOiBudW1iZXIpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLmNlbnRlci54ICtcbiAgICAgIHRoaXMudG9EZXZpY2VTY2FsZSh0aGlzLm9mZnNldFgpICtcbiAgICAgIHRoaXMudG9EZXZpY2VTY2FsZSh2YWwpO1xuICB9XG5cbiAgdG9EZXZpY2VZKHZhbDogbnVtYmVyKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5jZW50ZXIueSAtXG4gICAgICB0aGlzLnRvRGV2aWNlU2NhbGUodGhpcy5vZmZzZXRZKSAtXG4gICAgICB0aGlzLnRvRGV2aWNlU2NhbGUodmFsKTtcbiAgfVxuXG4gIGdldENlbnRlcigpOiBQb2ludCB7XG4gICAgY29uc3QgZWw6IEhUTUxEaXZFbGVtZW50ID0gdGhpcy5kaXZFbGVtZW50Lm5hdGl2ZUVsZW1lbnQ7XG4gICAgY29uc3QgY2VudGVyWCA9IGVsLmNsaWVudFdpZHRoIC8gMi4wIC0gZWwub2Zmc2V0TGVmdCAvIDIuMDtcbiAgICBjb25zdCBjZW50ZXJZID0gZWwuY2xpZW50SGVpZ2h0IC8gMi4wIC0gZWwub2Zmc2V0VG9wIC8gMi4wO1xuICAgIHJldHVybiBuZXcgUG9pbnQoY2VudGVyWCwgY2VudGVyWSk7XG4gIH1cblxuICBkcmF3RGF0YSgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5vZmZzY3JlZW5DYW52YXMud2lkdGggPiAwICYmIHRoaXMub2Zmc2NyZWVuQ2FudmFzLmhlaWdodCA+IDApIHtcbiAgICAgIGNvbnN0IGN0eCA9IHRoaXMuY2FudmFzUmVmLm5hdGl2ZUVsZW1lbnQuZ2V0Q29udGV4dCgnMmQnLCB7IGFscGhhOiBmYWxzZSB9KTtcbiAgICAgIGN0eC5jbGVhclJlY3QoMCwgMCwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xuICAgICAgY3R4LmRyYXdJbWFnZSh0aGlzLm9mZnNjcmVlbkNhbnZhcywgMCwgMCk7XG4gICAgfVxuICB9XG5cbiAgZHJhd09mZnNjcmVlbigpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuY2FudmFzVmFsaWQpIHtcbiAgICAgIHRoaXMuY2FudmFzVmFsaWQgPSB0cnVlO1xuICAgICAgdGhpcy5jZW50ZXIgPSB0aGlzLmdldENlbnRlcigpO1xuXG4gICAgICB0aGlzLmNvbnRleHQubGluZVdpZHRoID0gMTtcbiAgICAgIHRoaXMuY29udGV4dC5jbGVhclJlY3QoMCwgMCwgdGhpcy5jb250ZXh0LmNhbnZhcy53aWR0aCwgdGhpcy5jb250ZXh0LmNhbnZhcy5oZWlnaHQpO1xuICAgICAgdGhpcy5jb250ZXh0LmZpbGxTdHlsZSA9ICcjMzAzMDMwJztcbiAgICAgIHRoaXMuY29udGV4dC5maWxsUmVjdCgwLCAwLCB0aGlzLmNvbnRleHQuY2FudmFzLndpZHRoLCB0aGlzLmNvbnRleHQuY2FudmFzLmhlaWdodCk7XG5cbiAgICAgIGlmICh0aGlzLmRyYXdJdGVtcyAhPSBudWxsKSB7XG4gICAgICAgIGZvciAoY29uc3QgZW50cnkgb2YgdGhpcy5kcmF3SXRlbXMpIHtcbiAgICAgICAgICBpZiAoZW50cnkuZ2V0TGF5ZXIoKSA8IDApIHtcbiAgICAgICAgICAgIGVudHJ5LmRyYXcodGhpcyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRoaXMuZHJhd0dyaWQoKTtcblxuICAgICAgaWYgKHRoaXMuZHJhd0l0ZW1zICE9IG51bGwpIHtcbiAgICAgICAgZm9yIChjb25zdCBlbnRyeSBvZiB0aGlzLmRyYXdJdGVtcykge1xuICAgICAgICAgIGlmIChlbnRyeS5nZXRMYXllcigpID49IDApIHtcbiAgICAgICAgICAgIGVudHJ5LmRyYXcodGhpcyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRoaXMuZHJhd1ZlcnRpY2FsUnVsZXIoKTtcbiAgICAgIHRoaXMuZHJhd0hvcml6b250YWxSdWxlcigpO1xuXG4gICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4gdGhpcy5kcmF3RGF0YSgpKTtcbiAgICB9XG4gIH1cblxuICB0b0xvZ2ljYWwocG9pbnQ6IFBvaW50KTogUG9pbnQge1xuICAgIGNvbnN0IHJlc3VsdCA9IG5ldyBQb2ludChwb2ludC54LCBwb2ludC55KTtcblxuICAgIHJlc3VsdC54ID0gdGhpcy5mcm9tRGV2aWNlU2NhbGUocG9pbnQueCkgLVxuICAgICAgdGhpcy5vZmZzZXRYIC1cbiAgICAgIHRoaXMuZnJvbURldmljZVNjYWxlKHRoaXMuY2VudGVyLngpO1xuXG4gICAgcmVzdWx0LnkgPSAtKHRoaXMuZnJvbURldmljZVNjYWxlKHBvaW50LnkgLSB0aGlzLmNlbnRlci55KSArIHRoaXMub2Zmc2V0WSk7XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgZHJhd0hvcml6b250YWxSdWxlcigpOiB2b2lkIHtcbiAgICBjb25zdCBjZW50ZXIgPSBuZXcgUG9pbnQodGhpcy5jZW50ZXIueCwgdGhpcy5jZW50ZXIueSk7XG4gICAgY2VudGVyLnggKz0gdGhpcy50b0RldmljZVNjYWxlKHRoaXMub2Zmc2V0WCk7XG4gICAgY2VudGVyLnkgLT0gdGhpcy50b0RldmljZVNjYWxlKHRoaXMub2Zmc2V0WSk7XG4gICAgbGV0IHN0ZXAgPSB0aGlzLnRvRGV2aWNlU2NhbGUoMTApO1xuXG4gICAgd2hpbGUgKHN0ZXAgPCA1KSB7XG4gICAgICBzdGVwIC89IDAuNDA7XG4gICAgfVxuXG4gICAgd2hpbGUgKHN0ZXAgPiAxNSkge1xuICAgICAgc3RlcCAqPSAwLjQwO1xuICAgIH1cblxuICAgIHRoaXMuY29udGV4dC5saW5lV2lkdGggPSAwLjI1O1xuICAgIHRoaXMuY29udGV4dC5zdHJva2VTdHlsZSA9ICcjRkZGRkZGJztcbiAgICB0aGlzLmNvbnRleHQuYmVnaW5QYXRoKCk7XG5cbiAgICBsZXQgbGVuID0gMTA7XG4gICAgbGV0IGNudCA9IDA7XG5cbiAgICBmb3IgKGxldCB4ID0gY2VudGVyLng7IHggPj0gMDsgeCAtPSBzdGVwKSB7XG4gICAgICB0aGlzLmNvbnRleHQubW92ZVRvKHgsIDEwKTtcbiAgICAgIHRoaXMuY29udGV4dC5saW5lVG8oeCwgbGVuICsgMTApO1xuXG4gICAgICBjbnQrKztcbiAgICAgIGlmIChsZW4gPT09IDEwKSB7XG4gICAgICAgIHRoaXMuZHJhd1J1bGVyVGV4dCh4LCAwLCB0cnVlKTtcbiAgICAgICAgY250ID0gMDtcbiAgICAgICAgbGVuID0gNTtcbiAgICAgIH0gZWxzZSBpZiAoY250ID49IDQpIHtcbiAgICAgICAgbGVuID0gMTA7XG4gICAgICB9XG4gICAgfVxuXG4gICAgbGVuID0gNTtcbiAgICBjbnQgPSAwO1xuXG4gICAgZm9yIChsZXQgeCA9IGNlbnRlci54ICsgc3RlcDsgeCA8PSB0aGlzLmNvbnRleHQuY2FudmFzLndpZHRoOyB4ICs9IHN0ZXApIHtcbiAgICAgIHRoaXMuY29udGV4dC5tb3ZlVG8oeCwgMTApO1xuICAgICAgdGhpcy5jb250ZXh0LmxpbmVUbyh4LCBsZW4gKyAxMCk7XG5cbiAgICAgIGNudCsrO1xuICAgICAgaWYgKGxlbiA9PT0gMTApIHtcbiAgICAgICAgdGhpcy5kcmF3UnVsZXJUZXh0KHgsIDAsIHRydWUpO1xuICAgICAgICBjbnQgPSAwO1xuICAgICAgICBsZW4gPSA1O1xuICAgICAgfSBlbHNlIGlmIChjbnQgPj0gNCkge1xuICAgICAgICBsZW4gPSAxMDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmNvbnRleHQuY2xvc2VQYXRoKCk7XG4gICAgdGhpcy5jb250ZXh0LnN0cm9rZSgpO1xuICB9XG5cbiAgZHJhd1ZlcnRpY2FsUnVsZXIoKTogdm9pZCB7XG4gICAgY29uc3QgY2VudGVyID0gbmV3IFBvaW50KHRoaXMuY2VudGVyLngsIHRoaXMuY2VudGVyLnkpO1xuICAgIGNlbnRlci54ICs9IHRoaXMudG9EZXZpY2VTY2FsZSh0aGlzLm9mZnNldFgpO1xuICAgIGNlbnRlci55IC09IHRoaXMudG9EZXZpY2VTY2FsZSh0aGlzLm9mZnNldFkpO1xuICAgIGxldCBzdGVwID0gdGhpcy50b0RldmljZVNjYWxlKDEwKTtcblxuICAgIHdoaWxlIChzdGVwIDwgNSkge1xuICAgICAgc3RlcCAvPSAwLjQwO1xuICAgIH1cblxuICAgIHdoaWxlIChzdGVwID4gMTUpIHtcbiAgICAgIHN0ZXAgKj0gMC40MDtcbiAgICB9XG5cbiAgICB0aGlzLmNvbnRleHQubGluZVdpZHRoID0gMC4yNTtcbiAgICB0aGlzLmNvbnRleHQuc3Ryb2tlU3R5bGUgPSAnI0ZGRkZGRic7XG5cbiAgICB0aGlzLmNvbnRleHQuYmVnaW5QYXRoKCk7XG5cbiAgICBsZXQgbGVuID0gMTA7XG4gICAgbGV0IGNudCA9IDA7XG5cbiAgICBmb3IgKGxldCB5ID0gY2VudGVyLnk7IHkgPj0gMDsgeSAtPSBzdGVwKSB7XG4gICAgICB0aGlzLmNvbnRleHQubW92ZVRvKDAsIHkpO1xuICAgICAgdGhpcy5jb250ZXh0LmxpbmVUbyhsZW4sIHkpO1xuXG4gICAgICBjbnQrKztcbiAgICAgIGlmIChsZW4gPT09IDEwKSB7XG4gICAgICAgIHRoaXMuZHJhd1J1bGVyVGV4dCgxMiwgeSwgZmFsc2UpO1xuICAgICAgICBjbnQgPSAwO1xuICAgICAgICBsZW4gPSA1O1xuICAgICAgfSBlbHNlIGlmIChjbnQgPj0gNCkge1xuICAgICAgICBsZW4gPSAxMDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBsZW4gPSA1O1xuICAgIGNudCA9IDA7XG5cbiAgICBmb3IgKGxldCB5ID0gY2VudGVyLnkgKyBzdGVwOyB5IDw9IHRoaXMuY29udGV4dC5jYW52YXMuaGVpZ2h0OyB5ICs9IHN0ZXApIHtcbiAgICAgIHRoaXMuY29udGV4dC5tb3ZlVG8oMCwgeSk7XG4gICAgICB0aGlzLmNvbnRleHQubGluZVRvKGxlbiwgeSk7XG5cbiAgICAgIGNudCsrO1xuICAgICAgaWYgKGxlbiA9PT0gMTApIHtcbiAgICAgICAgdGhpcy5kcmF3UnVsZXJUZXh0KDEyLCB5LCBmYWxzZSk7XG4gICAgICAgIGNudCA9IDA7XG4gICAgICAgIGxlbiA9IDU7XG4gICAgICB9IGVsc2UgaWYgKGNudCA+PSA0KSB7XG4gICAgICAgIGxlbiA9IDEwO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuY29udGV4dC5jbG9zZVBhdGgoKTtcbiAgICB0aGlzLmNvbnRleHQuc3Ryb2tlKCk7XG4gIH1cblxuICBkcmF3UnVsZXJUZXh0KHg6IG51bWJlciwgeTogbnVtYmVyLCBob3Jpem9udGFsOiBib29sZWFuKTogdm9pZCB7XG4gICAgY29uc3QgbG9naWNhbFB0ID0gdGhpcy50b0xvZ2ljYWwobmV3IFBvaW50KHgsIHkpKTtcbiAgICBjb25zdCB0ZXh0ID0gaG9yaXpvbnRhbCA/IE1hdGgucm91bmQobG9naWNhbFB0LngpLnRvU3RyaW5nKCkgOiBNYXRoLnJvdW5kKGxvZ2ljYWxQdC55KS50b1N0cmluZygpO1xuXG4gICAgLy8vLy8gY29sb3IgZm9yIGJhY2tncm91bmRcbiAgICAvLyB0aGlzLmNvbnRleHQuZmlsbFN0eWxlID0gJyMzMDMwMzAnO1xuICAgIC8vLy8vIGdldCB3aWR0aCBvZiB0ZXh0XG4gICAgY29uc3Qgd2lkdGggPSB0aGlzLmNvbnRleHQubWVhc3VyZVRleHQodGV4dCkud2lkdGg7XG4gICAgLy8vLy8gZHJhdyBiYWNrZ3JvdW5kIHJlY3QgYXNzdW1pbmcgaGVpZ2h0IG9mIGZvbnRcbiAgICAvLyB0aGlzLmNvbnRleHQuZmlsbFJlY3QoeCAtIHdpZHRoIC8gMi4wLCB5IC0gNiwgd2lkdGgsIDEyKTtcblxuICAgIHRoaXMuY29udGV4dC5maWxsU3R5bGUgPSAnI0ZGRkZGRjRBJztcbiAgICBpZiAoaG9yaXpvbnRhbCkge1xuICAgICAgdGhpcy5jb250ZXh0LnRleHRCYXNlbGluZSA9ICd0b3AnO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHRoaXMuY29udGV4dC50ZXh0QmFzZWxpbmUgPSAnbWlkZGxlJztcbiAgICB9XG5cbiAgICBpZiAoaG9yaXpvbnRhbCkge1xuICAgICAgdGhpcy5jb250ZXh0LnRleHRBbGlnbiA9ICdjZW50ZXInO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHRoaXMuY29udGV4dC50ZXh0QWxpZ24gPSAnc3RhcnQnO1xuICAgIH1cblxuICAgIHRoaXMuY29udGV4dC5maWxsVGV4dCh0ZXh0LCB4LCB5LCB3aWR0aCk7XG4gIH1cblxuICBkcmF3R3JpZCgpOiB2b2lkIHtcbiAgICBjb25zdCBjZW50ZXIgPSBuZXcgUG9pbnQodGhpcy5jZW50ZXIueCwgdGhpcy5jZW50ZXIueSk7XG4gICAgY2VudGVyLnggKz0gdGhpcy50b0RldmljZVNjYWxlKHRoaXMub2Zmc2V0WCk7XG4gICAgY2VudGVyLnkgLT0gdGhpcy50b0RldmljZVNjYWxlKHRoaXMub2Zmc2V0WSk7XG4gICAgbGV0IHN0ZXAgPSB0aGlzLnRvRGV2aWNlU2NhbGUoMTApO1xuXG4gICAgd2hpbGUgKHN0ZXAgPCA1KSB7XG4gICAgICBzdGVwIC89IDAuNDA7XG4gICAgfVxuXG4gICAgd2hpbGUgKHN0ZXAgPiAxNSkge1xuICAgICAgc3RlcCAqPSAwLjQwO1xuICAgIH1cblxuICAgIHRoaXMuY29udGV4dC5saW5lV2lkdGggPSAwLjI1O1xuICAgIHRoaXMuY29udGV4dC5zdHJva2VTdHlsZSA9ICcjM0MzQzNDJztcbiAgICAvLyB0aGlzLmNvbnRleHQuc3Ryb2tlU3R5bGUgPSBcIiNGRkZGRkZcIjtcbiAgICB0aGlzLmNvbnRleHQuc2V0TGluZURhc2goWzQsIDJdKTtcbiAgICB0aGlzLmNvbnRleHQuYmVnaW5QYXRoKCk7XG5cbiAgICBmb3IgKGxldCB4ID0gY2VudGVyLng7IHggPj0gMDsgeCAtPSBzdGVwKSB7XG4gICAgICB0aGlzLmNvbnRleHQubW92ZVRvKHgsIDApO1xuICAgICAgdGhpcy5jb250ZXh0LmxpbmVUbyh4LCB0aGlzLmNvbnRleHQuY2FudmFzLmhlaWdodCk7XG4gICAgfVxuXG4gICAgZm9yIChsZXQgeCA9IGNlbnRlci54ICsgc3RlcDsgeCA8PSB0aGlzLmNvbnRleHQuY2FudmFzLndpZHRoOyB4ICs9IHN0ZXApIHtcbiAgICAgIHRoaXMuY29udGV4dC5tb3ZlVG8oeCwgMCk7XG4gICAgICB0aGlzLmNvbnRleHQubGluZVRvKHgsIHRoaXMuY29udGV4dC5jYW52YXMuaGVpZ2h0KTtcbiAgICB9XG5cbiAgICBmb3IgKGxldCB5ID0gY2VudGVyLnk7IHkgPj0gMDsgeSAtPSBzdGVwKSB7XG4gICAgICB0aGlzLmNvbnRleHQubW92ZVRvKDAsIHkpO1xuICAgICAgdGhpcy5jb250ZXh0LmxpbmVUbyh0aGlzLmNvbnRleHQuY2FudmFzLndpZHRoLCB5KTtcbiAgICB9XG5cbiAgICBmb3IgKGxldCB5ID0gY2VudGVyLnkgKyBzdGVwOyB5IDw9IHRoaXMuY29udGV4dC5jYW52YXMuaGVpZ2h0OyB5ICs9IHN0ZXApIHtcbiAgICAgIHRoaXMuY29udGV4dC5tb3ZlVG8oMCwgeSk7XG4gICAgICB0aGlzLmNvbnRleHQubGluZVRvKHRoaXMuY29udGV4dC5jYW52YXMud2lkdGgsIHkpO1xuICAgIH1cblxuICAgIHRoaXMuY29udGV4dC5jbG9zZVBhdGgoKTtcbiAgICB0aGlzLmNvbnRleHQuc3Ryb2tlKCk7XG5cbiAgICBzdGVwID0gc3RlcCAqIDU7XG4gICAgdGhpcy5jb250ZXh0LmxpbmVXaWR0aCA9IDAuNTtcbiAgICB0aGlzLmNvbnRleHQuc3Ryb2tlU3R5bGUgPSAnIzNDM0MzQyc7XG4gICAgdGhpcy5jb250ZXh0LmJlZ2luUGF0aCgpO1xuXG4gICAgY29uc3QgaHcgPSAwLjU7XG4gICAgY29uc3QgdyA9IDE7XG5cbiAgICBmb3IgKGxldCB4ID0gY2VudGVyLng7IHggPj0gMDsgeCAtPSBzdGVwKSB7XG4gICAgICBmb3IgKGxldCB5ID0gY2VudGVyLnk7IHkgPj0gMDsgeSAtPSBzdGVwKSB7XG4gICAgICAgIHRoaXMuY29udGV4dC5zdHJva2VSZWN0KHggLSBodywgeSAtIGh3LCB3LCB3KTtcbiAgICAgIH1cblxuICAgICAgZm9yIChsZXQgeSA9IGNlbnRlci55ICsgc3RlcDsgeSA8PSB0aGlzLmNvbnRleHQuY2FudmFzLmhlaWdodDsgeSArPSBzdGVwKSB7XG4gICAgICAgIHRoaXMuY29udGV4dC5zdHJva2VSZWN0KHggLSBodywgeSAtIGh3LCB3LCB3KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKGxldCB4ID0gY2VudGVyLnggKyBzdGVwOyB4IDw9IHRoaXMuY29udGV4dC5jYW52YXMud2lkdGg7IHggKz0gc3RlcCkge1xuICAgICAgZm9yIChsZXQgeSA9IGNlbnRlci55OyB5ID49IDA7IHkgLT0gc3RlcCkge1xuICAgICAgICB0aGlzLmNvbnRleHQuc3Ryb2tlUmVjdCh4IC0gaHcsIHkgLSBodywgdywgdyk7XG4gICAgICB9XG5cbiAgICAgIGZvciAobGV0IHkgPSBjZW50ZXIueSArIHN0ZXA7IHkgPD0gdGhpcy5jb250ZXh0LmNhbnZhcy5oZWlnaHQ7IHkgKz0gc3RlcCkge1xuICAgICAgICB0aGlzLmNvbnRleHQuc3Ryb2tlUmVjdCh4IC0gaHcsIHkgLSBodywgdywgdyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5jb250ZXh0LmNsb3NlUGF0aCgpO1xuICAgIHRoaXMuY29udGV4dC5zdHJva2UoKTtcbiAgICB0aGlzLmNvbnRleHQuc2V0TGluZURhc2goW10pO1xuXG4gICAgLy8gdGhpcy5jb250ZXh0LnN0cm9rZVN0eWxlID0gXCIjMDAwMDAwXCI7XG4gICAgLy8gdGhpcy5jb250ZXh0LmxpbmVXaWR0aCA9IDE7XG4gICAgLy8gdGhpcy5jb250ZXh0LmJlZ2luUGF0aCgpO1xuXG4gICAgLy8gdGhpcy5jb250ZXh0LnN0cm9rZVJlY3QoY2VudGVyLnggLSAyLCBjZW50ZXIueSAtIDIsIDQsIDQpO1xuICAgIC8vIHRoaXMuY29udGV4dC5zdHJva2UoKTtcblxuICAgIGlmICh0aGlzLmRyYXdBeGlzZXMpIHtcbiAgICAgIHRoaXMuZHJhd0Nvb3JkaW5hdGVTeXN0ZW0oKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGRyYXdDb29yZGluYXRlU3lzdGVtKCk6IHZvaWQge1xuICAgIGNvbnN0IGNhbGNIZWlnaHQgPSB0aGlzLmhlaWdodCAtIHRoaXMuZGl2RWxlbWVudC5uYXRpdmVFbGVtZW50Lm9mZnNldFRvcDtcblxuICAgIHRoaXMuY29udGV4dC5saW5lV2lkdGggPSAxO1xuICAgIHRoaXMuY29udGV4dC5zdHJva2VTdHlsZSA9ICcjMDBCRkE1JztcbiAgICB0aGlzLmNvbnRleHQuYmVnaW5QYXRoKCk7XG4gICAgdGhpcy5jb250ZXh0Lm1vdmVUbyg0MCwgY2FsY0hlaWdodCAtIDQwKTtcbiAgICB0aGlzLmNvbnRleHQubGluZVRvKDQwLCBjYWxjSGVpZ2h0IC0gMTQwKTtcbiAgICB0aGlzLmNvbnRleHQubGluZVRvKDQ1LCBjYWxjSGVpZ2h0IC0gMTM1KTtcbiAgICB0aGlzLmNvbnRleHQubGluZVRvKDM1LCBjYWxjSGVpZ2h0IC0gMTM1KTtcbiAgICB0aGlzLmNvbnRleHQubGluZVRvKDQwLCBjYWxjSGVpZ2h0IC0gMTQwKTtcbiAgICB0aGlzLmNvbnRleHQuc3Ryb2tlKCk7XG5cbiAgICB0aGlzLmNvbnRleHQubGluZVdpZHRoID0gMTtcbiAgICB0aGlzLmNvbnRleHQuc3Ryb2tlU3R5bGUgPSAnIzAwOTFFQSc7XG4gICAgdGhpcy5jb250ZXh0LmJlZ2luUGF0aCgpO1xuICAgIHRoaXMuY29udGV4dC5tb3ZlVG8oNDAsIGNhbGNIZWlnaHQgLSA0MCk7XG4gICAgdGhpcy5jb250ZXh0LmxpbmVUbygxNDAsIGNhbGNIZWlnaHQgLSA0MCk7XG4gICAgdGhpcy5jb250ZXh0LmxpbmVUbygxMzUsIGNhbGNIZWlnaHQgLSAzNSk7XG4gICAgdGhpcy5jb250ZXh0LmxpbmVUbygxMzUsIGNhbGNIZWlnaHQgLSA0NSk7XG4gICAgdGhpcy5jb250ZXh0LmxpbmVUbygxNDAsIGNhbGNIZWlnaHQgLSA0MCk7XG4gICAgdGhpcy5jb250ZXh0LnN0cm9rZSgpO1xuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcignbW91c2Vkb3duJywgWyckZXZlbnQnXSlcbiAgb25Nb3VzZWRvd24oZXZlbnQpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5pc1Bhbikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBwdCA9IG5ldyBQb2ludChldmVudC5jbGllbnRYLCBldmVudC5jbGllbnRZIC0gdGhpcy5kaXZFbGVtZW50Lm5hdGl2ZUVsZW1lbnQub2Zmc2V0VG9wKTtcbiAgICB0aGlzLnN0YXRlRXZlbnQgPSBldmVudDtcbiAgICBjb25zdCBzZCA9IG5ldyBTdXJmYWNlRGF0YShwdCwgdGhpcy50b0xvZ2ljYWwocHQpLCB0aGlzLCBldmVudCwgdGhpcy5zdGF0ZUV2ZW50KTtcbiAgICB0aGlzLmRvd24uZW1pdChzZCk7XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCdtb3VzZW1vdmUnLCBbJyRldmVudCddKVxuICBvbk1vdXNlbW92ZShldmVudDogTW91c2VFdmVudCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmlzUGFuKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IHB0ID0gbmV3IFBvaW50KGV2ZW50LmNsaWVudFgsIGV2ZW50LmNsaWVudFkgLSB0aGlzLmRpdkVsZW1lbnQubmF0aXZlRWxlbWVudC5vZmZzZXRUb3ApO1xuICAgIGNvbnN0IHNkID0gbmV3IFN1cmZhY2VEYXRhKHB0LCB0aGlzLnRvTG9naWNhbChwdCksIHRoaXMsIGV2ZW50LCB0aGlzLnN0YXRlRXZlbnQpO1xuICAgIHRoaXMucG9pbnRlclBvc2l0aW9uID0gc2QubW9kZWxQb2ludDtcbiAgICB0aGlzLm1vdmUuZW1pdChzZCk7XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCdtb3VzZXVwJywgWyckZXZlbnQnXSlcbiAgb25Nb3VzZXVwKGV2ZW50OiBNb3VzZUV2ZW50KTogdm9pZCB7XG4gICAgaWYgKHRoaXMuaXNQYW4pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgcHQgPSBuZXcgUG9pbnQoZXZlbnQuY2xpZW50WCwgZXZlbnQuY2xpZW50WSAtIHRoaXMuZGl2RWxlbWVudC5uYXRpdmVFbGVtZW50Lm9mZnNldFRvcCk7XG4gICAgY29uc3Qgc2QgPSBuZXcgU3VyZmFjZURhdGEocHQsIHRoaXMudG9Mb2dpY2FsKHB0KSwgdGhpcywgZXZlbnQsIHRoaXMuc3RhdGVFdmVudCk7XG4gICAgdGhpcy51cC5lbWl0KHNkKTtcbiAgICB0aGlzLnN0YXRlRXZlbnQgPSBldmVudDtcbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCBbJyRldmVudCddKVxuICBwcm90ZWN0ZWQgb25QYW5TdGFydChldmVudCk6IHZvaWQge1xuICAgIGlmIChldmVudC50b3VjaGVzICYmIGV2ZW50LnRvdWNoZXMubGVuZ3RoID4gMCkge1xuICAgICAgdGhpcy5pc1BhbiA9IHRydWU7XG4gICAgICB0aGlzLnN0YXRlRXZlbnQgPSBldmVudDtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBjb25zdCB0b3VjaCA9IGV2ZW50LnRvdWNoZXNbMF07XG4gICAgICBjb25zdCBwdCA9IG5ldyBQb2ludCh0b3VjaC5jbGllbnRYLCB0b3VjaC5jbGllbnRZIC0gdGhpcy5kaXZFbGVtZW50Lm5hdGl2ZUVsZW1lbnQub2Zmc2V0VG9wKTtcbiAgICAgIGNvbnN0IHNkID0gbmV3IFN1cmZhY2VEYXRhKHB0LCB0aGlzLnRvTG9naWNhbChwdCksIHRoaXMsIGV2ZW50LCB0aGlzLnN0YXRlRXZlbnQpO1xuICAgICAgdGhpcy5kb3duLmVtaXQoc2QpO1xuICAgIH1cbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ3RvdWNobW92ZScsIFsnJGV2ZW50J10pXG4gIHByb3RlY3RlZCBvblBhbk1vdmUoZXZlbnQpOiB2b2lkIHtcbiAgICBpZiAoZXZlbnQudG91Y2hlcyAmJiBldmVudC50b3VjaGVzLmxlbmd0aCA+IDApIHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBjb25zdCB0b3VjaCA9IGV2ZW50LnRvdWNoZXNbMF07XG4gICAgICBjb25zdCBwdCA9IG5ldyBQb2ludCh0b3VjaC5jbGllbnRYLCB0b3VjaC5jbGllbnRZIC0gdGhpcy5kaXZFbGVtZW50Lm5hdGl2ZUVsZW1lbnQub2Zmc2V0VG9wKTtcbiAgICAgIGNvbnN0IHNkID0gbmV3IFN1cmZhY2VEYXRhKHB0LCB0aGlzLnRvTG9naWNhbChwdCksIHRoaXMsIGV2ZW50LCB0aGlzLnN0YXRlRXZlbnQpO1xuICAgICAgdGhpcy5tb3ZlLmVtaXQoc2QpO1xuICAgIH1cbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ3RvdWNoZW5kJywgWyckZXZlbnQnXSlcbiAgcHJvdGVjdGVkIG9uUGFuRW5kKGV2ZW50KTogdm9pZCB7XG4gICAgaWYgKGV2ZW50LmNoYW5nZWRUb3VjaGVzICYmIGV2ZW50LmNoYW5nZWRUb3VjaGVzLmxlbmd0aCA+IDApIHtcbiAgICAgIHRoaXMuaXNQYW4gPSBmYWxzZTtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBjb25zdCB0b3VjaCA9IGV2ZW50LmNoYW5nZWRUb3VjaGVzWzBdO1xuICAgICAgY29uc3QgcHQgPSBuZXcgUG9pbnQodG91Y2guY2xpZW50WCwgdG91Y2guY2xpZW50WSAtIHRoaXMuZGl2RWxlbWVudC5uYXRpdmVFbGVtZW50Lm9mZnNldFRvcCk7XG4gICAgICBjb25zdCBzZCA9IG5ldyBTdXJmYWNlRGF0YShwdCwgdGhpcy50b0xvZ2ljYWwocHQpLCB0aGlzLCBldmVudCwgdGhpcy5zdGF0ZUV2ZW50KTtcbiAgICAgIHRoaXMudXAuZW1pdChzZCk7XG4gICAgICB0aGlzLnN0YXRlRXZlbnQgPSBldmVudDtcbiAgICB9XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCdtb3VzZXdoZWVsJywgWyckZXZlbnQnXSlcbiAgb25Nb3VzZXdoZWVsKGV2ZW50KTogdm9pZCB7XG4gICAgY29uc3QgcHQgPSBuZXcgUG9pbnQoZXZlbnQuY2xpZW50WCwgZXZlbnQuY2xpZW50WSAtIHRoaXMuZGl2RWxlbWVudC5uYXRpdmVFbGVtZW50Lm9mZnNldFRvcCk7XG4gICAgY29uc3Qgc2QgPSBuZXcgU3VyZmFjZURhdGEocHQsIHRoaXMudG9Mb2dpY2FsKHB0KSwgdGhpcywgZXZlbnQsIHRoaXMuc3RhdGVFdmVudCk7XG4gICAgdGhpcy53aGVlbFJvdGF0ZS5lbWl0KHNkKTtcbiAgfVxufVxuIl19