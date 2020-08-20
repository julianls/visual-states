import { ɵɵdefineInjectable, ɵsetClassMetadata, Injectable, EventEmitter, ɵɵdefineComponent, ɵɵstaticViewQuery, ɵɵqueryRefresh, ɵɵloadQuery, ɵɵlistener, ɵɵNgOnChangesFeature, ɵɵelementStart, ɵɵelement, ɵɵelementEnd, Component, ViewChild, Input, Output, HostListener, ɵɵdefineNgModule, ɵɵdefineInjector, ɵɵsetNgModuleScope, NgModule } from '@angular/core';
import { Point } from 'my-libs/base-geometry';

class SurfaceData {
    constructor(screenPoint, modelPoint, surface, event, stateEvent) {
        this.screenPoint = screenPoint;
        this.modelPoint = modelPoint;
        this.surface = surface;
        this.event = event;
        this.stateEvent = stateEvent;
    }
}

class ViewControl {
    constructor() {
        this.scale = 1.0;
        this.offsetX = 0.0;
        this.offsetY = 0.0;
        this.width = 0.0;
        this.height = 0.0;
        this.switch = false;
    }
    zoomIn() {
        this.scale /= 0.80;
    }
    zoomOut() {
        this.scale *= 0.80;
    }
    translateXPlus() {
        this.offsetX += 25;
    }
    translateXMinus() {
        this.offsetX -= 25;
    }
    translateYPlus() {
        this.offsetY += 25;
    }
    translateYMinus() {
        this.offsetY -= 25;
    }
    invalidate() {
        this.switch = !this.switch;
    }
}

class SurfaceDrawService {
    constructor() { }
}
SurfaceDrawService.ɵfac = function SurfaceDrawService_Factory(t) { return new (t || SurfaceDrawService)(); };
SurfaceDrawService.ɵprov = ɵɵdefineInjectable({ token: SurfaceDrawService, factory: SurfaceDrawService.ɵfac, providedIn: 'root' });
/*@__PURE__*/ (function () { ɵsetClassMetadata(SurfaceDrawService, [{
        type: Injectable,
        args: [{
                providedIn: 'root'
            }]
    }], function () { return []; }, null); })();

const _c0 = ["myCanvas"];
const _c1 = ["divElement"];
class SurfaceDrawComponent {
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
SurfaceDrawComponent.ɵcmp = ɵɵdefineComponent({ type: SurfaceDrawComponent, selectors: [["lib-surface-draw"]], viewQuery: function SurfaceDrawComponent_Query(rf, ctx) { if (rf & 1) {
        ɵɵstaticViewQuery(_c0, true);
        ɵɵstaticViewQuery(_c1, true);
    } if (rf & 2) {
        var _t;
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.canvasRef = _t.first);
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.divElement = _t.first);
    } }, hostBindings: function SurfaceDrawComponent_HostBindings(rf, ctx) { if (rf & 1) {
        ɵɵlistener("mousedown", function SurfaceDrawComponent_mousedown_HostBindingHandler($event) { return ctx.onMousedown($event); })("mousemove", function SurfaceDrawComponent_mousemove_HostBindingHandler($event) { return ctx.onMousemove($event); })("mouseup", function SurfaceDrawComponent_mouseup_HostBindingHandler($event) { return ctx.onMouseup($event); })("panstart", function SurfaceDrawComponent_panstart_HostBindingHandler($event) { return ctx.onPanStart($event); })("panmove", function SurfaceDrawComponent_panmove_HostBindingHandler($event) { return ctx.onPanMove($event); })("panend", function SurfaceDrawComponent_panend_HostBindingHandler($event) { return ctx.onPanEnd($event); })("mousewheel", function SurfaceDrawComponent_mousewheel_HostBindingHandler($event) { return ctx.onMousewheel($event); });
    } }, inputs: { drawItems: "drawItems", drawAxises: "drawAxises", scale: "scale", offsetX: "offsetX", offsetY: "offsetY", width: "width", height: "height", switch: "switch" }, outputs: { scaleChange: "scaleChange", offsetXChange: "offsetXChange", offsetYChange: "offsetYChange", widthChange: "widthChange", heightChange: "heightChange", down: "down", move: "move", up: "up", wheelRotate: "wheelRotate" }, features: [ɵɵNgOnChangesFeature], decls: 4, vars: 0, consts: [[1, "div-root"], ["divElement", ""], [1, "canvas-main"], ["myCanvas", ""]], template: function SurfaceDrawComponent_Template(rf, ctx) { if (rf & 1) {
        ɵɵelementStart(0, "div", 0, 1);
        ɵɵelement(2, "canvas", 2, 3);
        ɵɵelementEnd();
    } }, styles: [".canvas-main[_ngcontent-%COMP%] {\n    touch-action: none !important;\n  }\n\n  .div-root[_ngcontent-%COMP%] {\n    position: fixed;\n    width: 100%;\n    height: 100%;\n  }"] });
/*@__PURE__*/ (function () { ɵsetClassMetadata(SurfaceDrawComponent, [{
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

class SurfaceDrawModule {
}
SurfaceDrawModule.ɵmod = ɵɵdefineNgModule({ type: SurfaceDrawModule });
SurfaceDrawModule.ɵinj = ɵɵdefineInjector({ factory: function SurfaceDrawModule_Factory(t) { return new (t || SurfaceDrawModule)(); }, imports: [[]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && ɵɵsetNgModuleScope(SurfaceDrawModule, { declarations: [SurfaceDrawComponent], exports: [SurfaceDrawComponent] }); })();
/*@__PURE__*/ (function () { ɵsetClassMetadata(SurfaceDrawModule, [{
        type: NgModule,
        args: [{
                declarations: [SurfaceDrawComponent],
                imports: [],
                exports: [SurfaceDrawComponent]
            }]
    }], null, null); })();

/*
 * Public API Surface of surface-draw
 */

/**
 * Generated bundle index. Do not edit.
 */

export { SurfaceData, SurfaceDrawComponent, SurfaceDrawModule, SurfaceDrawService, ViewControl };
//# sourceMappingURL=surface-draw.js.map
