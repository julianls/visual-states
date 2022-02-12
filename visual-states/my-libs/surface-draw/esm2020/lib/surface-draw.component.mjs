import { Component, ViewChild, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { Point } from 'my-libs/base-geometry';
import { SurfaceData } from './surface-data';
import * as i0 from "@angular/core";
export class SurfaceDrawComponent {
    constructor() {
        this.drawAxises = false;
        this.drawDebug = false;
        this.scaleValue = 1;
        this.offsetXValue = 0;
        this.offsetYValue = 0;
        this.widthValue = 0;
        this.heightValue = 0;
        this.switchValue = false;
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
        this.controlTop = 0;
        this.controlLeft = 0;
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
        this.context.fillStyle = this.getFill(); // '#303030';
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
    calcOffsets() {
        let el = this.canvasRef.nativeElement;
        this.controlTop = 0;
        this.controlLeft = 0;
        while (el) {
            // console.log('parentElement => ' + el.parentElement);
            this.controlTop += el.offsetTop;
            this.controlLeft += el.offsetLeft;
            el = el.offsetParent;
        }
        // console.log('top => ' + this.contolTop);
        // console.log('left => ' + this.contolLeft);
    }
    getCenter() {
        this.calcOffsets();
        const el = this.divElement.nativeElement;
        const centerX = el.clientWidth / 2.0; // - this.controlLeft / 2.0;
        const centerY = el.clientHeight / 2.0; // - this.controlTop / 2.0;
        return new Point(centerX, centerY);
    }
    drawData() {
        if (this.offscreenCanvas.width > 0 && this.offscreenCanvas.height > 0) {
            const ctx = this.canvasRef.nativeElement.getContext('2d', { alpha: false });
            ctx.clearRect(0, 0, this.width, this.height);
            ctx.drawImage(this.offscreenCanvas, 0, 0);
        }
    }
    getFill() {
        return this.SurfaceFill; // this.divElement.nativeElement.style.background;
    }
    getGridStroke() {
        return this.SurfaceStroke; // this.divElement.nativeElement.style.color;
    }
    drawOffscreen() {
        if (!this.canvasValid) {
            this.canvasValid = true;
            this.center = this.getCenter();
            this.context.lineWidth = 1;
            this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
            this.context.fillStyle = this.getFill(); // '#303030';
            this.context.fillRect(0, 0, this.context.canvas.width, this.context.canvas.height);
            if (this.drawItems != null) {
                this.context.save();
                for (const entry of this.drawItems) {
                    if (entry.getLayer() < 0) {
                        entry.draw(this);
                    }
                }
                this.context.restore();
            }
            this.drawGrid();
            if (this.drawItems != null) {
                this.context.save();
                for (const entry of this.drawItems) {
                    if (entry.getLayer() >= 0) {
                        entry.draw(this);
                    }
                }
                this.context.restore();
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
        this.context.save();
        this.context.lineWidth = 0.25;
        this.context.strokeStyle = this.getGridStroke(); // '#FFFFFF';
        this.context.beginPath();
        let len = 10;
        let cnt = 0;
        for (let x = center.x; x >= 0; x -= step) {
            this.context.moveTo(x, 10);
            this.context.lineTo(x, len + 10);
            cnt++;
            if (len === 10) {
                this.drawRulerText(x, 5, true);
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
                this.drawRulerText(x, 5, true);
                cnt = 0;
                len = 5;
            }
            else if (cnt >= 4) {
                len = 10;
            }
        }
        this.context.closePath();
        this.context.stroke();
        this.context.restore();
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
        this.context.save();
        this.context.lineWidth = 0.25;
        this.context.strokeStyle = this.getGridStroke(); // '#FFFFFF';
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
        this.context.restore();
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
        this.context.fillStyle = this.getGridStroke(); // '#FFFFFF4A';
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
        this.context.save();
        this.context.globalAlpha = 0.4;
        this.context.lineWidth = 0.25;
        this.context.strokeStyle = this.getGridStroke(); // '#3C3C3C';
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
        this.context.strokeStyle = this.getGridStroke(); // '#3C3C3C';
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
        this.context.globalAlpha = 1;
        // this.context.strokeStyle = "#000000";
        // this.context.lineWidth = 1;
        // this.context.beginPath();
        // this.context.strokeRect(center.x - 2, center.y - 2, 4, 4);
        // this.context.stroke();
        if (this.drawAxises) {
            this.drawCoordinateSystem();
        }
        if (this.drawDebug) {
            this.drawDebugInfo();
        }
        this.context.restore();
    }
    drawDebugInfo() {
        const posX = 100;
        let posY = 100;
        this.context.fillStyle = this.getGridStroke();
        this.context.fillText('position => x:'
            + this.pointerPosition.x + ', y:'
            + this.pointerPosition.y, posX, posY);
        posY += 20;
        this.context.fillText('top/left => top:'
            + this.controlTop + ', left:'
            + this.controlLeft, posX, posY);
    }
    drawCoordinateSystem() {
        const calcHeight = this.height - this.controlTop;
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
        const pt = new Point(event.clientX - this.controlLeft, event.clientY - this.controlTop);
        this.stateEvent = event;
        const sd = new SurfaceData(pt, this.toLogical(pt), this, event, this.stateEvent);
        this.down.emit(sd);
    }
    onMousemove(event) {
        if (this.isPan) {
            return;
        }
        const pt = new Point(event.clientX - this.controlLeft, event.clientY - this.controlTop);
        const sd = new SurfaceData(pt, this.toLogical(pt), this, event, this.stateEvent);
        this.pointerPosition = sd.modelPoint;
        this.move.emit(sd);
    }
    onMouseup(event) {
        if (this.isPan) {
            return;
        }
        const pt = new Point(event.clientX - this.controlLeft, event.clientY - this.controlTop);
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
            const pt = new Point(touch.clientX - this.controlLeft, touch.clientY - this.controlTop);
            const sd = new SurfaceData(pt, this.toLogical(pt), this, event, this.stateEvent);
            this.down.emit(sd);
        }
    }
    onPanMove(event) {
        if (event.touches && event.touches.length > 0) {
            event.preventDefault();
            const touch = event.touches[0];
            const pt = new Point(touch.clientX - this.controlLeft, touch.clientY - this.controlTop);
            const sd = new SurfaceData(pt, this.toLogical(pt), this, event, this.stateEvent);
            this.move.emit(sd);
        }
    }
    onPanEnd(event) {
        if (event.changedTouches && event.changedTouches.length > 0) {
            this.isPan = false;
            event.preventDefault();
            const touch = event.changedTouches[0];
            const pt = new Point(touch.clientX - this.controlLeft, touch.clientY - this.controlTop);
            const sd = new SurfaceData(pt, this.toLogical(pt), this, event, this.stateEvent);
            this.up.emit(sd);
            this.stateEvent = event;
        }
    }
    onMousewheel(event) {
        const pt = new Point(event.clientX - this.controlLeft, event.clientY - this.controlTop);
        const sd = new SurfaceData(pt, this.toLogical(pt), this, event, this.stateEvent);
        this.wheelRotate.emit(sd);
    }
}
SurfaceDrawComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.1", ngImport: i0, type: SurfaceDrawComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
SurfaceDrawComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.0.1", type: SurfaceDrawComponent, selector: "lib-surface-draw", inputs: { drawItems: "drawItems", SurfaceFill: "SurfaceFill", SurfaceStroke: "SurfaceStroke", drawAxises: "drawAxises", drawDebug: "drawDebug", scale: "scale", offsetX: "offsetX", offsetY: "offsetY", width: "width", height: "height", switch: "switch" }, outputs: { scaleChange: "scaleChange", offsetXChange: "offsetXChange", offsetYChange: "offsetYChange", widthChange: "widthChange", heightChange: "heightChange", down: "down", move: "move", up: "up", wheelRotate: "wheelRotate" }, host: { listeners: { "mousedown": "onMousedown($event)", "mousemove": "onMousemove($event)", "mouseup": "onMouseup($event)", "touchstart": "onPanStart($event)", "touchmove": "onPanMove($event)", "touchend": "onPanEnd($event)", "mousewheel": "onMousewheel($event)" } }, viewQueries: [{ propertyName: "canvasRef", first: true, predicate: ["myCanvas"], descendants: true, static: true }, { propertyName: "divElement", first: true, predicate: ["divElement"], descendants: true, static: true }], usesOnChanges: true, ngImport: i0, template: `
  <div #divElement class="div-root">
    <canvas #myCanvas class="canvas-main">
    </canvas>
  </div>
  `, isInline: true, styles: [".canvas-main{touch-action:none!important}.div-root{width:100%;height:100%}\n"] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.1", ngImport: i0, type: SurfaceDrawComponent, decorators: [{
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
    width: 100%;
    height: 100%;
  }
  `]
                }]
        }], ctorParameters: function () { return []; }, propDecorators: { canvasRef: [{
                type: ViewChild,
                args: ['myCanvas', { static: true }]
            }], divElement: [{
                type: ViewChild,
                args: ['divElement', { static: true }]
            }], drawItems: [{
                type: Input
            }], SurfaceFill: [{
                type: Input
            }], SurfaceStroke: [{
                type: Input
            }], drawAxises: [{
                type: Input
            }], drawDebug: [{
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
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3VyZmFjZS1kcmF3LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL3N1cmZhY2UtZHJhdy9zcmMvbGliL3N1cmZhY2UtZHJhdy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBVSxTQUFTLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQXdDLFlBQVksRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUU5SSxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFDOUMsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGdCQUFnQixDQUFDOztBQXFCN0MsTUFBTSxPQUFPLG9CQUFvQjtJQTZDL0I7UUF0Q1MsZUFBVSxHQUFHLEtBQUssQ0FBQztRQUNuQixjQUFTLEdBQUcsS0FBSyxDQUFDO1FBSW5CLGVBQVUsR0FBRyxDQUFDLENBQUM7UUFDZixpQkFBWSxHQUFHLENBQUMsQ0FBQztRQUNqQixpQkFBWSxHQUFHLENBQUMsQ0FBQztRQUNqQixlQUFVLEdBQUcsQ0FBQyxDQUFDO1FBQ2YsZ0JBQVcsR0FBRyxDQUFDLENBQUM7UUFDaEIsZ0JBQVcsR0FBRyxLQUFLLENBQUM7UUFFbEIsZ0JBQVcsR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO1FBQ2pDLGtCQUFhLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUNuQyxrQkFBYSxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7UUFDbkMsZ0JBQVcsR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO1FBQ2pDLGlCQUFZLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUVwQyxXQUFNLEdBQVUsSUFBSSxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ2hDLG9CQUFlLEdBQVUsSUFBSSxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBR3pDLGdCQUFXLEdB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UUFBUSxDQUFDO2dCQVlyQyxXQUFXO3NCQURWLFlBQVk7dUJBQUMsV0FBVyxFQUFFLENBQUMsUUFBUSxDQUFDO2dCQVlyQyxTQUFTO3NCQURSLFlBQVk7dUJBQUMsU0FBUyxFQUFFLENBQUMsUUFBUSxDQUFDO2dCQVl6QixVQUFVO3NCQURuQixZQUFZO3VCQUFDLFlBQVksRUFBRSxDQUFDLFFBQVEsQ0FBQztnQkFjNUIsU0FBUztzQkFEbEIsWUFBWTt1QkFBQyxXQUFXLEVBQUUsQ0FBQyxRQUFRLENBQUM7Z0JBWTNCLFFBQVE7c0JBRGpCLFlBQVk7dUJBQUMsVUFBVSxFQUFFLENBQUMsUUFBUSxDQUFDO2dCQWNwQyxZQUFZO3NCQURYLFlBQVk7dUJBQUMsWUFBWSxFQUFFLENBQUMsUUFBUSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQsIFZpZXdDaGlsZCwgSW5wdXQsIE91dHB1dCwgRXZlbnRFbWl0dGVyLCBFbGVtZW50UmVmLCBBZnRlclZpZXdJbml0LCBPbkNoYW5nZXMsIEhvc3RMaXN0ZW5lciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgSVN1cmZhY2VEcmF3LCBJRHJhd2FibGUsIElQb2ludCB9IGZyb20gJ215LWxpYnMvYmFzZS1kcmF3JztcbmltcG9ydCB7IFBvaW50IH0gZnJvbSAnbXktbGlicy9iYXNlLWdlb21ldHJ5JztcbmltcG9ydCB7IFN1cmZhY2VEYXRhIH0gZnJvbSAnLi9zdXJmYWNlLWRhdGEnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdsaWItc3VyZmFjZS1kcmF3JyxcbiAgdGVtcGxhdGU6IGBcbiAgPGRpdiAjZGl2RWxlbWVudCBjbGFzcz1cImRpdi1yb290XCI+XG4gICAgPGNhbnZhcyAjbXlDYW52YXMgY2xhc3M9XCJjYW52YXMtbWFpblwiPlxuICAgIDwvY2FudmFzPlxuICA8L2Rpdj5cbiAgYCxcbiAgc3R5bGVzOiBbYFxuICAuY2FudmFzLW1haW4ge1xuICAgIHRvdWNoLWFjdGlvbjogbm9uZSAhaW1wb3J0YW50O1xuICB9XG5cbiAgLmRpdi1yb290IHtcbiAgICB3aWR0aDogMTAwJTtcbiAgICBoZWlnaHQ6IDEwMCU7XG4gIH1cbiAgYF1cbn0pXG5leHBvcnQgY2xhc3MgU3VyZmFjZURyYXdDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uQ2hhbmdlcywgQWZ0ZXJWaWV3SW5pdCwgSVN1cmZhY2VEcmF3IHtcbiAgQFZpZXdDaGlsZCgnbXlDYW52YXMnLCB7IHN0YXRpYzogdHJ1ZSB9KSBjYW52YXNSZWY6IEVsZW1lbnRSZWY7XG4gIEBWaWV3Q2hpbGQoJ2RpdkVsZW1lbnQnLCB7IHN0YXRpYzogdHJ1ZSB9KSBkaXZFbGVtZW50OiBhbnk7XG5cbiAgQElucHV0KCkgZHJhd0l0ZW1zOiBJRHJhd2FibGVbXTtcbiAgQElucHV0KCkgU3VyZmFjZUZpbGw6IHN0cmluZztcbiAgQElucHV0KCkgU3VyZmFjZVN0cm9rZTogc3RyaW5nO1xuICBASW5wdXQoKSBkcmF3QXhpc2VzID0gZmFsc2U7XG4gIEBJbnB1dCgpIGRyYXdEZWJ1ZyA9IGZhbHNlO1xuXG4gIHByaXZhdGUgb2Zmc2NyZWVuQ2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudDtcblxuICBwcml2YXRlIHNjYWxlVmFsdWUgPSAxO1xuICBwcml2YXRlIG9mZnNldFhWYWx1ZSA9IDA7XG4gIHByaXZhdGUgb2Zmc2V0WVZhbHVlID0gMDtcbiAgcHJpdmF0ZSB3aWR0aFZhbHVlID0gMDtcbiAgcHJpdmF0ZSBoZWlnaHRWYWx1ZSA9IDA7XG4gIHByaXZhdGUgc3dpdGNoVmFsdWUgPSBmYWxzZTtcblxuICBAT3V0cHV0KCkgc2NhbGVDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoKSBvZmZzZXRYQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCkgb2Zmc2V0WUNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgQE91dHB1dCgpIHdpZHRoQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCkgaGVpZ2h0Q2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gIHByaXZhdGUgY2VudGVyOiBQb2ludCA9IG5ldyBQb2ludCgwLCAwKTtcbiAgcHJpdmF0ZSBwb2ludGVyUG9zaXRpb246IFBvaW50ID0gbmV3IFBvaW50KDAsIDApO1xuXG4gIHByaXZhdGUgY29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xuICBwcml2YXRlIGNhbnZhc1ZhbGlkID0gZmFsc2U7XG4gIC8vIHByaXZhdGUgbGFzdFJlZnJlc2hIYW5kbGU6IG51bWJlcjtcbiAgLy8gcHJpdmF0ZSBjYW5jZWxSZWZyZXNoQ291bnRlcjogbnVtYmVyID0gMDtcblxuICBwcml2YXRlIGlzUGFuID0gZmFsc2U7XG5cbiAgQE91dHB1dCgpIGRvd246IEV2ZW50RW1pdHRlcjxTdXJmYWNlRGF0YT4gPSBuZXcgRXZlbnRFbWl0dGVyPFN1cmZhY2VEYXRhPigpO1xuICBAT3V0cHV0KCkgbW92ZTogRXZlbnRFbWl0dGVyPFN1cmZhY2VEYXRhPiA9IG5ldyBFdmVudEVtaXR0ZXI8U3VyZmFjZURhdGE+KCk7XG4gIEBPdXRwdXQoKSB1cDogRXZlbnRFbWl0dGVyPFN1cmZhY2VEYXRhPiA9IG5ldyBFdmVudEVtaXR0ZXI8U3VyZmFjZURhdGE+KCk7XG4gIEBPdXRwdXQoKSB3aGVlbFJvdGF0ZTogRXZlbnRFbWl0dGVyPFN1cmZhY2VEYXRhPiA9IG5ldyBFdmVudEVtaXR0ZXI8U3VyZmFjZURhdGE+KCk7XG4gIC8vIEBPdXRwdXQoKSBjbGljazogRXZlbnRFbWl0dGVyPFBvaW50PiA9IG5ldyBFdmVudEVtaXR0ZXI8UG9pbnQ+KCk7XG5cbiAgcHJpdmF0ZSBzdGF0ZUV2ZW50OiBhbnkgPSBudWxsO1xuICBwcml2YXRlIGNvbnRyb2xUb3AgPSAwO1xuICBwcml2YXRlIGNvbnRyb2xMZWZ0ID0gMDtcblxuICBjb25zdHJ1Y3RvcigpIHsgfVxuXG4gIEBJbnB1dCgpXG4gIHNldCBzY2FsZSh2YWwpIHtcbiAgICBpZiAodGhpcy5zY2FsZVZhbHVlICE9PSB2YWwpIHtcbiAgICAgIHRoaXMuc2NhbGVWYWx1ZSA9IHZhbDtcbiAgICAgIHRoaXMuc2NhbGVDaGFuZ2UuZW1pdCh0aGlzLnNjYWxlVmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIGdldCBzY2FsZSgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLnNjYWxlVmFsdWU7XG4gIH1cblxuICBASW5wdXQoKVxuICBzZXQgb2Zmc2V0WCh2YWwpIHtcbiAgICBpZiAodGhpcy5vZmZzZXRYVmFsdWUgIT09IHZhbCkge1xuICAgICAgdGhpcy5vZmZzZXRYVmFsdWUgPSB2YWw7XG4gICAgICB0aGlzLm9mZnNldFhDaGFuZ2UuZW1pdCh0aGlzLm9mZnNldFhWYWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgZ2V0IG9mZnNldFgoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5vZmZzZXRYVmFsdWU7XG4gIH1cblxuICBASW5wdXQoKVxuICBzZXQgb2Zmc2V0WSh2YWwpIHtcbiAgICBpZiAodGhpcy5vZmZzZXRYVmFsdWUgIT09IHZhbCkge1xuICAgICAgdGhpcy5vZmZzZXRZVmFsdWUgPSB2YWw7XG4gICAgICB0aGlzLm9mZnNldFlDaGFuZ2UuZW1pdCh0aGlzLm9mZnNldFlWYWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgZ2V0IG9mZnNldFkoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5vZmZzZXRZVmFsdWU7XG4gIH1cblxuICBnZXQgd2lkdGgoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy53aWR0aFZhbHVlO1xuICB9XG5cbiAgQElucHV0KClcbiAgc2V0IHdpZHRoKHZhbCkge1xuICAgIGlmICh0aGlzLndpZHRoVmFsdWUgIT09IHZhbCkge1xuICAgICAgdGhpcy53aWR0aFZhbHVlID0gdmFsO1xuICAgICAgdGhpcy53aWR0aENoYW5nZS5lbWl0KHRoaXMud2lkdGhWYWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgZ2V0IGhlaWdodCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLmhlaWdodFZhbHVlO1xuICB9XG5cbiAgQElucHV0KClcbiAgc2V0IGhlaWdodCh2YWwpIHtcbiAgICBpZiAodGhpcy5oZWlnaHRWYWx1ZSAhPT0gdmFsKSB7XG4gICAgICB0aGlzLmhlaWdodFZhbHVlID0gdmFsO1xuICAgICAgdGhpcy5oZWlnaHRDaGFuZ2UuZW1pdCh0aGlzLmhlaWdodFZhbHVlKTtcbiAgICB9XG4gIH1cblxuICBASW5wdXQoKVxuICBzZXQgc3dpdGNoKHZhbCkge1xuICAgIGlmICh0aGlzLnN3aXRjaFZhbHVlICE9PSB2YWwpIHtcbiAgICAgIHRoaXMuc3dpdGNoVmFsdWUgPSB2YWw7XG4gICAgICB0aGlzLmludmFsaWRhdGVEcmF3aW5nKCk7XG4gICAgfVxuICB9XG5cbiAgZ2V0IHN3aXRjaCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5zd2l0Y2hWYWx1ZTtcbiAgfVxuXG4gIGdldCBtb3VzZVBvc2l0aW9uKCk6IElQb2ludCB7XG4gICAgcmV0dXJuIHRoaXMucG9pbnRlclBvc2l0aW9uO1xuICB9XG5cbiAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgdGhpcy5vZmZzY3JlZW5DYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcbiAgICB0aGlzLmNhbnZhc1ZhbGlkID0gdHJ1ZTtcbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpOiB2b2lkIHtcbiAgICAvLyB0aGlzLmNvbnRleHQgPSB0aGlzLmNhbnZhc1JlZi5uYXRpdmVFbGVtZW50LmdldENvbnRleHQoJzJkJyk7XG4gICAgdGhpcy5jb250ZXh0ID0gdGhpcy5vZmZzY3JlZW5DYW52YXMuZ2V0Q29udGV4dCgnMmQnLCB7IGFscGhhOiBmYWxzZSB9KTtcbiAgICB3aW5kb3cub25yZXNpemUgPSB0aGlzLnJlc2l6ZUNhbnZhcy5iaW5kKHRoaXMpO1xuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB0aGlzLnJlc2l6ZUNhbnZhcyh0aGlzLmRpdkVsZW1lbnQpKTtcbiAgfVxuXG4gIHByaXZhdGUgcmVzaXplQ2FudmFzKF86IFVJRXZlbnQpOiB2b2lkIHtcbiAgICBjb25zdCBlbDogSFRNTERpdkVsZW1lbnQgPSB0aGlzLmRpdkVsZW1lbnQubmF0aXZlRWxlbWVudDtcbiAgICB0aGlzLndpZHRoID0gZWwuY2xpZW50V2lkdGg7XG4gICAgdGhpcy5oZWlnaHQgPSBlbC5jbGllbnRIZWlnaHQ7XG4gICAgdGhpcy5vZmZzY3JlZW5DYW52YXMud2lkdGggPSB0aGlzLndpZHRoO1xuICAgIHRoaXMub2Zmc2NyZWVuQ2FudmFzLmhlaWdodCA9IHRoaXMuaGVpZ2h0O1xuICAgIHRoaXMuY2FudmFzUmVmLm5hdGl2ZUVsZW1lbnQud2lkdGggPSBlbC5jbGllbnRXaWR0aDtcbiAgICB0aGlzLmNhbnZhc1JlZi5uYXRpdmVFbGVtZW50LmhlaWdodCA9IGVsLmNsaWVudEhlaWdodDtcbiAgICB0aGlzLmludmFsaWRhdGVEcmF3aW5nKCk7XG4gIH1cblxuXG4gIG5nT25DaGFuZ2VzKCk6IHZvaWQge1xuICAgIC8vIHRoaXMuY29udGV4dCA9IHRoaXMuY2FudmFzUmVmLm5hdGl2ZUVsZW1lbnQuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICBpZiAodGhpcy5vZmZzY3JlZW5DYW52YXMpIHtcbiAgICAgIHRoaXMuY29udGV4dCA9IHRoaXMub2Zmc2NyZWVuQ2FudmFzLmdldENvbnRleHQoJzJkJywgeyBhbHBoYTogZmFsc2UgfSk7XG4gICAgICB0aGlzLmludmFsaWRhdGVEcmF3aW5nKCk7XG4gICAgfVxuICB9XG5cbiAgaW52YWxpZGF0ZURyYXdpbmcoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuY2FudmFzVmFsaWQpIHtcbiAgICAgIHRoaXMuY2FudmFzVmFsaWQgPSBmYWxzZTtcbiAgICAgIC8vIHRoaXMuY2FuY2VsUmVmcmVzaENvdW50ZXIrKztcbiAgICAgIC8vIGlmICh0aGlzLmNhbmNlbFJlZnJlc2hDb3VudGVyIDwgMTApXG4gICAgICAvLyAgY2FuY2VsQW5pbWF0aW9uRnJhbWUodGhpcy5sYXN0UmVmcmVzaEhhbmRsZSk7XG4gICAgICAvLyBlbHNlXG4gICAgICAvLyAgdGhpcy5jYW5jZWxSZWZyZXNoQ291bnRlciA9IDA7XG4gICAgICAvLyB0aGlzLmxhc3RSZWZyZXNoSGFuZGxlID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHRoaXMuZHJhd09mZnNjcmVlbigpKTtcbiAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB0aGlzLmRyYXdPZmZzY3JlZW4oKSk7XG4gICAgfVxuICB9XG5cbiAgbGluZSh4MTogbnVtYmVyLCB5MTogbnVtYmVyLCB4MjogbnVtYmVyLCB5MjogbnVtYmVyLCBzdHJva2VTdHlsZTogc3RyaW5nID0gJyNGM0U1RjUnKTogdm9pZCB7XG4gICAgdGhpcy5jb250ZXh0LnN0cm9rZVN0eWxlID0gc3Ryb2tlU3R5bGU7XG4gICAgdGhpcy5jb250ZXh0LmJlZ2luUGF0aCgpO1xuICAgIHRoaXMuY29udGV4dC5tb3ZlVG8odGhpcy50b0RldmljZVgoeDEpLCB0aGlzLnRvRGV2aWNlWSh5MSkpO1xuICAgIHRoaXMuY29udGV4dC5saW5lVG8odGhpcy50b0RldmljZVgoeDIpLCB0aGlzLnRvRGV2aWNlWSh5MikpO1xuICAgIHRoaXMuY29udGV4dC5zdHJva2UoKTtcbiAgfVxuXG4gIHBvbHlsaW5lKHBvaW50czogSVBvaW50W10sIHN0cm9rZVN0eWxlOiBzdHJpbmcgPSAnI0YzRTVGNScpOiB2b2lkIHtcbiAgICB0aGlzLmNvbnRleHQuc3Ryb2tlU3R5bGUgPSBzdHJva2VTdHlsZTtcbiAgICB0aGlzLmNvbnRleHQuYmVnaW5QYXRoKCk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwb2ludHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChpID09PSAwKSB7XG4gICAgICAgIHRoaXMuY29udGV4dC5tb3ZlVG8odGhpcy50b0RldmljZVgocG9pbnRzW2ldLngpLCB0aGlzLnRvRGV2aWNlWShwb2ludHNbaV0ueSkpO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIHRoaXMuY29udGV4dC5saW5lVG8odGhpcy50b0RldmljZVgocG9pbnRzW2ldLngpLCB0aGlzLnRvRGV2aWNlWShwb2ludHNbaV0ueSkpO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLmNvbnRleHQuc3Ryb2tlKCk7XG4gIH1cblxuICBwb2x5Z29uKHBvaW50czogSVBvaW50W10sIHN0cm9rZVN0eWxlOiBzdHJpbmcgPSAnI0YzRTVGNScsIGZpbGxTdHlsZT86IHN0cmluZyk6IHZvaWQge1xuICAgIHRoaXMuY29udGV4dC5zdHJva2VTdHlsZSA9IHN0cm9rZVN0eWxlO1xuICAgIHRoaXMuY29udGV4dC5iZWdpblBhdGgoKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBvaW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKGkgPT09IDApIHtcbiAgICAgICAgdGhpcy5jb250ZXh0Lm1vdmVUbyh0aGlzLnRvRGV2aWNlWChwb2ludHNbaV0ueCksIHRoaXMudG9EZXZpY2VZKHBvaW50c1tpXS55KSk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgdGhpcy5jb250ZXh0LmxpbmVUbyh0aGlzLnRvRGV2aWNlWChwb2ludHNbaV0ueCksIHRoaXMudG9EZXZpY2VZKHBvaW50c1tpXS55KSk7XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuY29udGV4dC5jbG9zZVBhdGgoKTtcblxuICAgIGlmIChmaWxsU3R5bGUpIHtcbiAgICAgIGNvbnN0IG9sZEZpbGwgPSB0aGlzLmNvbnRleHQuZmlsbFN0eWxlO1xuICAgICAgdGhpcy5jb250ZXh0LmZpbGxTdHlsZSA9IGZpbGxTdHlsZTtcbiAgICAgIHRoaXMuY29udGV4dC5maWxsKCk7XG4gICAgICB0aGlzLmNvbnRleHQuZmlsbFN0eWxlID0gb2xkRmlsbDtcbiAgICB9XG5cbiAgICB0aGlzLmNvbnRleHQuc3Ryb2tlKCk7XG4gIH1cblxuICBiZXppZXJDdXJ2ZSh4MTogbnVtYmVyLCB5MTogbnVtYmVyLCBjcDF4OiBudW1iZXIsIGNwMXk6IG51bWJlciwgY3AyeDogbnVtYmVyLCBjcDJ5OiBudW1iZXIsIHgyOiBudW1iZXIsIHkyOiBudW1iZXIsIHN0cm9rZVN0eWxlOiBzdHJpbmcgPSAnI0YzRTVGNScpOiB2b2lkIHtcbiAgICB0aGlzLmNvbnRleHQuc3Ryb2tlU3R5bGUgPSBzdHJva2VTdHlsZTtcbiAgICB0aGlzLmNvbnRleHQuYmVnaW5QYXRoKCk7XG4gICAgdGhpcy5jb250ZXh0Lm1vdmVUbyh0aGlzLnRvRGV2aWNlWCh4MSksIHRoaXMudG9EZXZpY2VZKHkxKSk7XG4gICAgdGhpcy5jb250ZXh0LmJlemllckN1cnZlVG8odGhpcy50b0RldmljZVgoY3AxeCksIHRoaXMudG9EZXZpY2VZKGNwMXkpLFxuICAgICAgdGhpcy50b0RldmljZVgoY3AyeCksIHRoaXMudG9EZXZpY2VZKGNwMnkpLCB0aGlzLnRvRGV2aWNlWCh4MiksIHRoaXMudG9EZXZpY2VZKHkyKSk7XG4gICAgdGhpcy5jb250ZXh0LnN0cm9rZSgpO1xuICB9XG5cbiAgcmVjdCh4MTogbnVtYmVyLCB5MTogbnVtYmVyLCB3OiBudW1iZXIsIGg6IG51bWJlciwgc3Ryb2tlU3R5bGU6IHN0cmluZyA9ICcjRjNFNUY1Jyk6IHZvaWQge1xuICAgIHRoaXMuY29udGV4dC5zdHJva2VTdHlsZSA9IHN0cm9rZVN0eWxlO1xuICAgIGNvbnN0IHdpZHRoID0gdGhpcy50b0RldmljZVNjYWxlKHcpO1xuICAgIGNvbnN0IGhlaWdodCA9IHRoaXMudG9EZXZpY2VTY2FsZShoKTtcbiAgICB0aGlzLmNvbnRleHQuc3Ryb2tlUmVjdCh0aGlzLnRvRGV2aWNlWCh4MSksIHRoaXMudG9EZXZpY2VZKHkxKSAtIGhlaWdodCwgd2lkdGgsIGhlaWdodCk7XG4gIH1cblxuICB0ZXh0KHRleHQ6IHN0cmluZywgeDogbnVtYmVyLCB5OiBudW1iZXIsIGZvbnQ6IHN0cmluZyA9IG51bGwsIHN0cm9rZVN0eWxlOiBzdHJpbmcgPSAnI0YzRTVGNScpOiB2b2lkIHtcbiAgICB4ID0gdGhpcy50b0RldmljZVgoeCk7XG4gICAgeSA9IHRoaXMudG9EZXZpY2VZKHkpO1xuICAgIC8vLyBjb2xvciBmb3IgYmFja2dyb3VuZFxuICAgIHRoaXMuY29udGV4dC5maWxsU3R5bGUgPSB0aGlzLmdldEZpbGwoKTsgLy8gJyMzMDMwMzAnO1xuICAgIC8vLyBnZXQgd2lkdGggb2YgdGV4dFxuICAgIGNvbnN0IG9sZEZvbnQgPSB0aGlzLmNvbnRleHQuZm9udDtcbiAgICBpZiAoZm9udCkge1xuICAgICAgdGhpcy5jb250ZXh0LmZvbnQgPSBmb250O1xuICAgIH1cbiAgICBjb25zdCB3aWR0aCA9IHRoaXMuY29udGV4dC5tZWFzdXJlVGV4dCh0ZXh0KS53aWR0aDtcbiAgICAvLy8gZHJhdyBiYWNrZ3JvdW5kIHJlY3QgYXNzdW1pbmcgaGVpZ2h0IG9mIGZvbnRcbiAgICB0aGlzLmNvbnRleHQuZmlsbFJlY3QoeCAtIHdpZHRoIC8gMi4wLCB5IC0gNiwgd2lkdGgsIDEyKTtcblxuICAgIHRoaXMuY29udGV4dC5maWxsU3R5bGUgPSBzdHJva2VTdHlsZTtcbiAgICB0aGlzLmNvbnRleHQudGV4dEJhc2VsaW5lID0gJ21pZGRsZSc7XG4gICAgdGhpcy5jb250ZXh0LnRleHRBbGlnbiA9ICdjZW50ZXInO1xuICAgIHRoaXMuY29udGV4dC5maWxsVGV4dCh0ZXh0LCB4LCB5LCB3aWR0aCk7XG4gICAgaWYgKGZvbnQpIHtcbiAgICAgIHRoaXMuY29udGV4dC5mb250ID0gb2xkRm9udDtcbiAgICB9XG4gIH1cblxuICBpbWFnZShpbWc6IEltYWdlQml0bWFwLCB4OiBudW1iZXIsIHk6IG51bWJlciwgd2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIsIHNjYWxlOiBudW1iZXIpOiB2b2lkIHtcbiAgICB4ID0gdGhpcy50b0RldmljZVgoeCk7XG4gICAgeSA9IHRoaXMudG9EZXZpY2VZKHkpO1xuICAgIHdpZHRoID0gdGhpcy50b0RldmljZVNjYWxlKHdpZHRoICogc2NhbGUpO1xuICAgIGhlaWdodCA9IHRoaXMudG9EZXZpY2VTY2FsZShoZWlnaHQgKiBzY2FsZSk7XG5cbiAgICB0aGlzLmNvbnRleHQuZHJhd0ltYWdlKGltZywgMCwgMCwgaW1nLndpZHRoLCBpbWcuaGVpZ2h0LCB4LCB5IC0gaGVpZ2h0LCB3aWR0aCwgaGVpZ2h0KTtcbiAgfVxuXG4gIGZyb21EZXZpY2VTY2FsZSh2YWw6IG51bWJlcik6IG51bWJlciB7XG4gICAgcmV0dXJuIHZhbCAvIHRoaXMuc2NhbGU7XG4gIH1cblxuICB0b0RldmljZVNjYWxlKHZhbDogbnVtYmVyKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdmFsICogdGhpcy5zY2FsZTtcbiAgfVxuXG4gIHRvRGV2aWNlWCh2YWw6IG51bWJlcik6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuY2VudGVyLnggK1xuICAgICAgdGhpcy50b0RldmljZVNjYWxlKHRoaXMub2Zmc2V0WCkgK1xuICAgICAgdGhpcy50b0RldmljZVNjYWxlKHZhbCk7XG4gIH1cblxuICB0b0RldmljZVkodmFsOiBudW1iZXIpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLmNlbnRlci55IC1cbiAgICAgIHRoaXMudG9EZXZpY2VTY2FsZSh0aGlzLm9mZnNldFkpIC1cbiAgICAgIHRoaXMudG9EZXZpY2VTY2FsZSh2YWwpO1xuICB9XG5cbiAgcHJpdmF0ZSBjYWxjT2Zmc2V0cygpOiB2b2lkIHtcbiAgICBsZXQgZWwgPSB0aGlzLmNhbnZhc1JlZi5uYXRpdmVFbGVtZW50O1xuXG4gICAgdGhpcy5jb250cm9sVG9wID0gMDtcbiAgICB0aGlzLmNvbnRyb2xMZWZ0ID0gMDtcblxuICAgIHdoaWxlIChlbCl7XG4gICAgICAvLyBjb25zb2xlLmxvZygncGFyZW50RWxlbWVudCA9PiAnICsgZWwucGFyZW50RWxlbWVudCk7XG4gICAgICB0aGlzLmNvbnRyb2xUb3AgKz0gZWwub2Zmc2V0VG9wO1xuICAgICAgdGhpcy5jb250cm9sTGVmdCArPSBlbC5vZmZzZXRMZWZ0O1xuICAgICAgZWwgPSBlbC5vZmZzZXRQYXJlbnQ7XG4gICAgfVxuXG4gICAgLy8gY29uc29sZS5sb2coJ3RvcCA9PiAnICsgdGhpcy5jb250b2xUb3ApO1xuICAgIC8vIGNvbnNvbGUubG9nKCdsZWZ0ID0+ICcgKyB0aGlzLmNvbnRvbExlZnQpO1xuICB9XG5cbiAgZ2V0Q2VudGVyKCk6IFBvaW50IHtcbiAgICB0aGlzLmNhbGNPZmZzZXRzKCk7XG4gICAgY29uc3QgZWwgPSB0aGlzLmRpdkVsZW1lbnQubmF0aXZlRWxlbWVudDtcbiAgICBjb25zdCBjZW50ZXJYID0gZWwuY2xpZW50V2lkdGggLyAyLjA7IC8vIC0gdGhpcy5jb250cm9sTGVmdCAvIDIuMDtcbiAgICBjb25zdCBjZW50ZXJZID0gZWwuY2xpZW50SGVpZ2h0IC8gMi4wOyAvLyAtIHRoaXMuY29udHJvbFRvcCAvIDIuMDtcbiAgICByZXR1cm4gbmV3IFBvaW50KGNlbnRlclgsIGNlbnRlclkpO1xuICB9XG5cbiAgZHJhd0RhdGEoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMub2Zmc2NyZWVuQ2FudmFzLndpZHRoID4gMCAmJiB0aGlzLm9mZnNjcmVlbkNhbnZhcy5oZWlnaHQgPiAwKSB7XG4gICAgICBjb25zdCBjdHggPSB0aGlzLmNhbnZhc1JlZi5uYXRpdmVFbGVtZW50LmdldENvbnRleHQoJzJkJywgeyBhbHBoYTogZmFsc2UgfSk7XG4gICAgICBjdHguY2xlYXJSZWN0KDAsIDAsIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KTtcbiAgICAgIGN0eC5kcmF3SW1hZ2UodGhpcy5vZmZzY3JlZW5DYW52YXMsIDAsIDApO1xuICAgIH1cbiAgfVxuXG4gIGdldEZpbGwoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5TdXJmYWNlRmlsbDsgLy8gdGhpcy5kaXZFbGVtZW50Lm5hdGl2ZUVsZW1lbnQuc3R5bGUuYmFja2dyb3VuZDtcbiAgfVxuXG4gIGdldEdyaWRTdHJva2UoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gIHRoaXMuU3VyZmFjZVN0cm9rZTsgLy8gdGhpcy5kaXZFbGVtZW50Lm5hdGl2ZUVsZW1lbnQuc3R5bGUuY29sb3I7XG4gIH1cblxuICBkcmF3T2Zmc2NyZWVuKCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5jYW52YXNWYWxpZCkge1xuICAgICAgdGhpcy5jYW52YXNWYWxpZCA9IHRydWU7XG4gICAgICB0aGlzLmNlbnRlciA9IHRoaXMuZ2V0Q2VudGVyKCk7XG5cbiAgICAgIHRoaXMuY29udGV4dC5saW5lV2lkdGggPSAxO1xuICAgICAgdGhpcy5jb250ZXh0LmNsZWFyUmVjdCgwLCAwLCB0aGlzLmNvbnRleHQuY2FudmFzLndpZHRoLCB0aGlzLmNvbnRleHQuY2FudmFzLmhlaWdodCk7XG4gICAgICB0aGlzLmNvbnRleHQuZmlsbFN0eWxlID0gdGhpcy5nZXRGaWxsKCk7IC8vICcjMzAzMDMwJztcbiAgICAgIHRoaXMuY29udGV4dC5maWxsUmVjdCgwLCAwLCB0aGlzLmNvbnRleHQuY2FudmFzLndpZHRoLCB0aGlzLmNvbnRleHQuY2FudmFzLmhlaWdodCk7XG5cblxuICAgICAgaWYgKHRoaXMuZHJhd0l0ZW1zICE9IG51bGwpIHtcbiAgICAgICAgdGhpcy5jb250ZXh0LnNhdmUoKTtcbiAgICAgICAgZm9yIChjb25zdCBlbnRyeSBvZiB0aGlzLmRyYXdJdGVtcykge1xuICAgICAgICAgIGlmIChlbnRyeS5nZXRMYXllcigpIDwgMCkge1xuICAgICAgICAgICAgZW50cnkuZHJhdyh0aGlzKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jb250ZXh0LnJlc3RvcmUoKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5kcmF3R3JpZCgpO1xuXG4gICAgICBpZiAodGhpcy5kcmF3SXRlbXMgIT0gbnVsbCkge1xuICAgICAgICB0aGlzLmNvbnRleHQuc2F2ZSgpO1xuICAgICAgICBmb3IgKGNvbnN0IGVudHJ5IG9mIHRoaXMuZHJhd0l0ZW1zKSB7XG4gICAgICAgICAgaWYgKGVudHJ5LmdldExheWVyKCkgPj0gMCkge1xuICAgICAgICAgICAgZW50cnkuZHJhdyh0aGlzKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jb250ZXh0LnJlc3RvcmUoKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5kcmF3VmVydGljYWxSdWxlcigpO1xuICAgICAgdGhpcy5kcmF3SG9yaXpvbnRhbFJ1bGVyKCk7XG5cbiAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB0aGlzLmRyYXdEYXRhKCkpO1xuICAgIH1cbiAgfVxuXG4gIHRvTG9naWNhbChwb2ludDogUG9pbnQpOiBQb2ludCB7XG4gICAgY29uc3QgcmVzdWx0ID0gbmV3IFBvaW50KHBvaW50LngsIHBvaW50LnkpO1xuXG4gICAgcmVzdWx0LnggPSB0aGlzLmZyb21EZXZpY2VTY2FsZShwb2ludC54KSAtXG4gICAgICB0aGlzLm9mZnNldFggLVxuICAgICAgdGhpcy5mcm9tRGV2aWNlU2NhbGUodGhpcy5jZW50ZXIueCk7XG5cbiAgICByZXN1bHQueSA9IC0odGhpcy5mcm9tRGV2aWNlU2NhbGUocG9pbnQueSAtIHRoaXMuY2VudGVyLnkpICsgdGhpcy5vZmZzZXRZKTtcblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBkcmF3SG9yaXpvbnRhbFJ1bGVyKCk6IHZvaWQge1xuICAgIGNvbnN0IGNlbnRlciA9IG5ldyBQb2ludCh0aGlzLmNlbnRlci54LCB0aGlzLmNlbnRlci55KTtcbiAgICBjZW50ZXIueCArPSB0aGlzLnRvRGV2aWNlU2NhbGUodGhpcy5vZmZzZXRYKTtcbiAgICBjZW50ZXIueSAtPSB0aGlzLnRvRGV2aWNlU2NhbGUodGhpcy5vZmZzZXRZKTtcbiAgICBsZXQgc3RlcCA9IHRoaXMudG9EZXZpY2VTY2FsZSgxMCk7XG5cbiAgICB3aGlsZSAoc3RlcCA8IDUpIHtcbiAgICAgIHN0ZXAgLz0gMC40MDtcbiAgICB9XG5cbiAgICB3aGlsZSAoc3RlcCA+IDE1KSB7XG4gICAgICBzdGVwICo9IDAuNDA7XG4gICAgfVxuXG4gICAgdGhpcy5jb250ZXh0LnNhdmUoKTtcbiAgICB0aGlzLmNvbnRleHQubGluZVdpZHRoID0gMC4yNTtcbiAgICB0aGlzLmNvbnRleHQuc3Ryb2tlU3R5bGUgPSB0aGlzLmdldEdyaWRTdHJva2UoKTsgLy8gJyNGRkZGRkYnO1xuICAgIHRoaXMuY29udGV4dC5iZWdpblBhdGgoKTtcblxuICAgIGxldCBsZW4gPSAxMDtcbiAgICBsZXQgY250ID0gMDtcblxuICAgIGZvciAobGV0IHggPSBjZW50ZXIueDsgeCA+PSAwOyB4IC09IHN0ZXApIHtcbiAgICAgIHRoaXMuY29udGV4dC5tb3ZlVG8oeCwgMTApO1xuICAgICAgdGhpcy5jb250ZXh0LmxpbmVUbyh4LCBsZW4gKyAxMCk7XG5cbiAgICAgIGNudCsrO1xuICAgICAgaWYgKGxlbiA9PT0gMTApIHtcbiAgICAgICAgdGhpcy5kcmF3UnVsZXJUZXh0KHgsIDUsIHRydWUpO1xuICAgICAgICBjbnQgPSAwO1xuICAgICAgICBsZW4gPSA1O1xuICAgICAgfSBlbHNlIGlmIChjbnQgPj0gNCkge1xuICAgICAgICBsZW4gPSAxMDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBsZW4gPSA1O1xuICAgIGNudCA9IDA7XG5cbiAgICBmb3IgKGxldCB4ID0gY2VudGVyLnggKyBzdGVwOyB4IDw9IHRoaXMuY29udGV4dC5jYW52YXMud2lkdGg7IHggKz0gc3RlcCkge1xuICAgICAgdGhpcy5jb250ZXh0Lm1vdmVUbyh4LCAxMCk7XG4gICAgICB0aGlzLmNvbnRleHQubGluZVRvKHgsIGxlbiArIDEwKTtcblxuICAgICAgY250Kys7XG4gICAgICBpZiAobGVuID09PSAxMCkge1xuICAgICAgICB0aGlzLmRyYXdSdWxlclRleHQoeCwgNSwgdHJ1ZSk7XG4gICAgICAgIGNudCA9IDA7XG4gICAgICAgIGxlbiA9IDU7XG4gICAgICB9IGVsc2UgaWYgKGNudCA+PSA0KSB7XG4gICAgICAgIGxlbiA9IDEwO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuY29udGV4dC5jbG9zZVBhdGgoKTtcbiAgICB0aGlzLmNvbnRleHQuc3Ryb2tlKCk7XG4gICAgdGhpcy5jb250ZXh0LnJlc3RvcmUoKTtcbiAgfVxuXG4gIGRyYXdWZXJ0aWNhbFJ1bGVyKCk6IHZvaWQge1xuICAgIGNvbnN0IGNlbnRlciA9IG5ldyBQb2ludCh0aGlzLmNlbnRlci54LCB0aGlzLmNlbnRlci55KTtcbiAgICBjZW50ZXIueCArPSB0aGlzLnRvRGV2aWNlU2NhbGUodGhpcy5vZmZzZXRYKTtcbiAgICBjZW50ZXIueSAtPSB0aGlzLnRvRGV2aWNlU2NhbGUodGhpcy5vZmZzZXRZKTtcbiAgICBsZXQgc3RlcCA9IHRoaXMudG9EZXZpY2VTY2FsZSgxMCk7XG5cbiAgICB3aGlsZSAoc3RlcCA8IDUpIHtcbiAgICAgIHN0ZXAgLz0gMC40MDtcbiAgICB9XG5cbiAgICB3aGlsZSAoc3RlcCA+IDE1KSB7XG4gICAgICBzdGVwICo9IDAuNDA7XG4gICAgfVxuXG4gICAgdGhpcy5jb250ZXh0LnNhdmUoKTtcbiAgICB0aGlzLmNvbnRleHQubGluZVdpZHRoID0gMC4yNTtcbiAgICB0aGlzLmNvbnRleHQuc3Ryb2tlU3R5bGUgPSB0aGlzLmdldEdyaWRTdHJva2UoKTsgLy8gJyNGRkZGRkYnO1xuXG4gICAgdGhpcy5jb250ZXh0LmJlZ2luUGF0aCgpO1xuXG4gICAgbGV0IGxlbiA9IDEwO1xuICAgIGxldCBjbnQgPSAwO1xuXG4gICAgZm9yIChsZXQgeSA9IGNlbnRlci55OyB5ID49IDA7IHkgLT0gc3RlcCkge1xuICAgICAgdGhpcy5jb250ZXh0Lm1vdmVUbygwLCB5KTtcbiAgICAgIHRoaXMuY29udGV4dC5saW5lVG8obGVuLCB5KTtcblxuICAgICAgY250Kys7XG4gICAgICBpZiAobGVuID09PSAxMCkge1xuICAgICAgICB0aGlzLmRyYXdSdWxlclRleHQoMTIsIHksIGZhbHNlKTtcbiAgICAgICAgY250ID0gMDtcbiAgICAgICAgbGVuID0gNTtcbiAgICAgIH0gZWxzZSBpZiAoY250ID49IDQpIHtcbiAgICAgICAgbGVuID0gMTA7XG4gICAgICB9XG4gICAgfVxuXG4gICAgbGVuID0gNTtcbiAgICBjbnQgPSAwO1xuXG4gICAgZm9yIChsZXQgeSA9IGNlbnRlci55ICsgc3RlcDsgeSA8PSB0aGlzLmNvbnRleHQuY2FudmFzLmhlaWdodDsgeSArPSBzdGVwKSB7XG4gICAgICB0aGlzLmNvbnRleHQubW92ZVRvKDAsIHkpO1xuICAgICAgdGhpcy5jb250ZXh0LmxpbmVUbyhsZW4sIHkpO1xuXG4gICAgICBjbnQrKztcbiAgICAgIGlmIChsZW4gPT09IDEwKSB7XG4gICAgICAgIHRoaXMuZHJhd1J1bGVyVGV4dCgxMiwgeSwgZmFsc2UpO1xuICAgICAgICBjbnQgPSAwO1xuICAgICAgICBsZW4gPSA1O1xuICAgICAgfSBlbHNlIGlmIChjbnQgPj0gNCkge1xuICAgICAgICBsZW4gPSAxMDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmNvbnRleHQuY2xvc2VQYXRoKCk7XG4gICAgdGhpcy5jb250ZXh0LnN0cm9rZSgpO1xuICAgIHRoaXMuY29udGV4dC5yZXN0b3JlKCk7XG4gIH1cblxuICBkcmF3UnVsZXJUZXh0KHg6IG51bWJlciwgeTogbnVtYmVyLCBob3Jpem9udGFsOiBib29sZWFuKTogdm9pZCB7XG4gICAgY29uc3QgbG9naWNhbFB0ID0gdGhpcy50b0xvZ2ljYWwobmV3IFBvaW50KHgsIHkpKTtcbiAgICBjb25zdCB0ZXh0ID0gaG9yaXpvbnRhbCA/IE1hdGgucm91bmQobG9naWNhbFB0LngpLnRvU3RyaW5nKCkgOiBNYXRoLnJvdW5kKGxvZ2ljYWxQdC55KS50b1N0cmluZygpO1xuXG4gICAgLy8vLy8gY29sb3IgZm9yIGJhY2tncm91bmRcbiAgICAvLyB0aGlzLmNvbnRleHQuZmlsbFN0eWxlID0gJyMzMDMwMzAnO1xuICAgIC8vLy8vIGdldCB3aWR0aCBvZiB0ZXh0XG4gICAgY29uc3Qgd2lkdGggPSB0aGlzLmNvbnRleHQubWVhc3VyZVRleHQodGV4dCkud2lkdGg7XG4gICAgLy8vLy8gZHJhdyBiYWNrZ3JvdW5kIHJlY3QgYXNzdW1pbmcgaGVpZ2h0IG9mIGZvbnRcbiAgICAvLyB0aGlzLmNvbnRleHQuZmlsbFJlY3QoeCAtIHdpZHRoIC8gMi4wLCB5IC0gNiwgd2lkdGgsIDEyKTtcblxuICAgIHRoaXMuY29udGV4dC5maWxsU3R5bGUgPSB0aGlzLmdldEdyaWRTdHJva2UoKTsgLy8gJyNGRkZGRkY0QSc7XG4gICAgaWYgKGhvcml6b250YWwpIHtcbiAgICAgIHRoaXMuY29udGV4dC50ZXh0QmFzZWxpbmUgPSAndG9wJztcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB0aGlzLmNvbnRleHQudGV4dEJhc2VsaW5lID0gJ21pZGRsZSc7XG4gICAgfVxuXG4gICAgaWYgKGhvcml6b250YWwpIHtcbiAgICAgIHRoaXMuY29udGV4dC50ZXh0QWxpZ24gPSAnY2VudGVyJztcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB0aGlzLmNvbnRleHQudGV4dEFsaWduID0gJ3N0YXJ0JztcbiAgICB9XG5cbiAgICB0aGlzLmNvbnRleHQuZmlsbFRleHQodGV4dCwgeCwgeSwgd2lkdGgpO1xuICB9XG5cbiAgZHJhd0dyaWQoKTogdm9pZCB7XG4gICAgY29uc3QgY2VudGVyID0gbmV3IFBvaW50KHRoaXMuY2VudGVyLngsIHRoaXMuY2VudGVyLnkpO1xuICAgIGNlbnRlci54ICs9IHRoaXMudG9EZXZpY2VTY2FsZSh0aGlzLm9mZnNldFgpO1xuICAgIGNlbnRlci55IC09IHRoaXMudG9EZXZpY2VTY2FsZSh0aGlzLm9mZnNldFkpO1xuICAgIGxldCBzdGVwID0gdGhpcy50b0RldmljZVNjYWxlKDEwKTtcblxuICAgIHdoaWxlIChzdGVwIDwgNSkge1xuICAgICAgc3RlcCAvPSAwLjQwO1xuICAgIH1cblxuICAgIHdoaWxlIChzdGVwID4gMTUpIHtcbiAgICAgIHN0ZXAgKj0gMC40MDtcbiAgICB9XG5cbiAgICB0aGlzLmNvbnRleHQuc2F2ZSgpO1xuICAgIHRoaXMuY29udGV4dC5nbG9iYWxBbHBoYSA9IDAuNDtcbiAgICB0aGlzLmNvbnRleHQubGluZVdpZHRoID0gMC4yNTtcbiAgICB0aGlzLmNvbnRleHQuc3Ryb2tlU3R5bGUgPSB0aGlzLmdldEdyaWRTdHJva2UoKTsgLy8gJyMzQzNDM0MnO1xuICAgIC8vIHRoaXMuY29udGV4dC5zdHJva2VTdHlsZSA9IFwiI0ZGRkZGRlwiO1xuICAgIHRoaXMuY29udGV4dC5zZXRMaW5lRGFzaChbNCwgMl0pO1xuICAgIHRoaXMuY29udGV4dC5iZWdpblBhdGgoKTtcblxuICAgIGZvciAobGV0IHggPSBjZW50ZXIueDsgeCA+PSAwOyB4IC09IHN0ZXApIHtcbiAgICAgIHRoaXMuY29udGV4dC5tb3ZlVG8oeCwgMCk7XG4gICAgICB0aGlzLmNvbnRleHQubGluZVRvKHgsIHRoaXMuY29udGV4dC5jYW52YXMuaGVpZ2h0KTtcbiAgICB9XG5cbiAgICBmb3IgKGxldCB4ID0gY2VudGVyLnggKyBzdGVwOyB4IDw9IHRoaXMuY29udGV4dC5jYW52YXMud2lkdGg7IHggKz0gc3RlcCkge1xuICAgICAgdGhpcy5jb250ZXh0Lm1vdmVUbyh4LCAwKTtcbiAgICAgIHRoaXMuY29udGV4dC5saW5lVG8oeCwgdGhpcy5jb250ZXh0LmNhbnZhcy5oZWlnaHQpO1xuICAgIH1cblxuICAgIGZvciAobGV0IHkgPSBjZW50ZXIueTsgeSA+PSAwOyB5IC09IHN0ZXApIHtcbiAgICAgIHRoaXMuY29udGV4dC5tb3ZlVG8oMCwgeSk7XG4gICAgICB0aGlzLmNvbnRleHQubGluZVRvKHRoaXMuY29udGV4dC5jYW52YXMud2lkdGgsIHkpO1xuICAgIH1cblxuICAgIGZvciAobGV0IHkgPSBjZW50ZXIueSArIHN0ZXA7IHkgPD0gdGhpcy5jb250ZXh0LmNhbnZhcy5oZWlnaHQ7IHkgKz0gc3RlcCkge1xuICAgICAgdGhpcy5jb250ZXh0Lm1vdmVUbygwLCB5KTtcbiAgICAgIHRoaXMuY29udGV4dC5saW5lVG8odGhpcy5jb250ZXh0LmNhbnZhcy53aWR0aCwgeSk7XG4gICAgfVxuXG4gICAgdGhpcy5jb250ZXh0LmNsb3NlUGF0aCgpO1xuICAgIHRoaXMuY29udGV4dC5zdHJva2UoKTtcblxuICAgIHN0ZXAgPSBzdGVwICogNTtcbiAgICB0aGlzLmNvbnRleHQubGluZVdpZHRoID0gMC41O1xuICAgIHRoaXMuY29udGV4dC5zdHJva2VTdHlsZSA9IHRoaXMuZ2V0R3JpZFN0cm9rZSgpOyAvLyAnIzNDM0MzQyc7XG4gICAgdGhpcy5jb250ZXh0LmJlZ2luUGF0aCgpO1xuXG4gICAgY29uc3QgaHcgPSAwLjU7XG4gICAgY29uc3QgdyA9IDE7XG5cbiAgICBmb3IgKGxldCB4ID0gY2VudGVyLng7IHggPj0gMDsgeCAtPSBzdGVwKSB7XG4gICAgICBmb3IgKGxldCB5ID0gY2VudGVyLnk7IHkgPj0gMDsgeSAtPSBzdGVwKSB7XG4gICAgICAgIHRoaXMuY29udGV4dC5zdHJva2VSZWN0KHggLSBodywgeSAtIGh3LCB3LCB3KTtcbiAgICAgIH1cblxuICAgICAgZm9yIChsZXQgeSA9IGNlbnRlci55ICsgc3RlcDsgeSA8PSB0aGlzLmNvbnRleHQuY2FudmFzLmhlaWdodDsgeSArPSBzdGVwKSB7XG4gICAgICAgIHRoaXMuY29udGV4dC5zdHJva2VSZWN0KHggLSBodywgeSAtIGh3LCB3LCB3KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKGxldCB4ID0gY2VudGVyLnggKyBzdGVwOyB4IDw9IHRoaXMuY29udGV4dC5jYW52YXMud2lkdGg7IHggKz0gc3RlcCkge1xuICAgICAgZm9yIChsZXQgeSA9IGNlbnRlci55OyB5ID49IDA7IHkgLT0gc3RlcCkge1xuICAgICAgICB0aGlzLmNvbnRleHQuc3Ryb2tlUmVjdCh4IC0gaHcsIHkgLSBodywgdywgdyk7XG4gICAgICB9XG5cbiAgICAgIGZvciAobGV0IHkgPSBjZW50ZXIueSArIHN0ZXA7IHkgPD0gdGhpcy5jb250ZXh0LmNhbnZhcy5oZWlnaHQ7IHkgKz0gc3RlcCkge1xuICAgICAgICB0aGlzLmNvbnRleHQuc3Ryb2tlUmVjdCh4IC0gaHcsIHkgLSBodywgdywgdyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5jb250ZXh0LmNsb3NlUGF0aCgpO1xuICAgIHRoaXMuY29udGV4dC5zdHJva2UoKTtcbiAgICB0aGlzLmNvbnRleHQuc2V0TGluZURhc2goW10pO1xuICAgIHRoaXMuY29udGV4dC5nbG9iYWxBbHBoYSA9IDE7XG5cbiAgICAvLyB0aGlzLmNvbnRleHQuc3Ryb2tlU3R5bGUgPSBcIiMwMDAwMDBcIjtcbiAgICAvLyB0aGlzLmNvbnRleHQubGluZVdpZHRoID0gMTtcbiAgICAvLyB0aGlzLmNvbnRleHQuYmVnaW5QYXRoKCk7XG5cbiAgICAvLyB0aGlzLmNvbnRleHQuc3Ryb2tlUmVjdChjZW50ZXIueCAtIDIsIGNlbnRlci55IC0gMiwgNCwgNCk7XG4gICAgLy8gdGhpcy5jb250ZXh0LnN0cm9rZSgpO1xuXG4gICAgaWYgKHRoaXMuZHJhd0F4aXNlcykge1xuICAgICAgdGhpcy5kcmF3Q29vcmRpbmF0ZVN5c3RlbSgpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmRyYXdEZWJ1Zykge1xuICAgICAgdGhpcy5kcmF3RGVidWdJbmZvKCk7XG4gICAgfVxuXG4gICAgdGhpcy5jb250ZXh0LnJlc3RvcmUoKTtcbiAgfVxuXG4gIHByaXZhdGUgZHJhd0RlYnVnSW5mbygpOiB2b2lkIHtcbiAgICBjb25zdCBwb3NYID0gMTAwO1xuICAgIGxldCBwb3NZID0gMTAwO1xuXG4gICAgdGhpcy5jb250ZXh0LmZpbGxTdHlsZSA9IHRoaXMuZ2V0R3JpZFN0cm9rZSgpO1xuXG4gICAgdGhpcy5jb250ZXh0LmZpbGxUZXh0KCdwb3NpdGlvbiA9PiB4OidcbiAgICAgICsgdGhpcy5wb2ludGVyUG9zaXRpb24ueCArICcsIHk6J1xuICAgICAgKyB0aGlzLnBvaW50ZXJQb3NpdGlvbi55LFxuICAgICAgcG9zWCwgcG9zWSk7XG5cbiAgICBwb3NZICs9IDIwO1xuXG4gICAgdGhpcy5jb250ZXh0LmZpbGxUZXh0KCd0b3AvbGVmdCA9PiB0b3A6J1xuICAgICAgKyB0aGlzLmNvbnRyb2xUb3AgKyAnLCBsZWZ0OidcbiAgICAgICsgdGhpcy5jb250cm9sTGVmdCxcbiAgICAgIHBvc1gsIHBvc1kpO1xuXG4gIH1cblxuICBwcml2YXRlIGRyYXdDb29yZGluYXRlU3lzdGVtKCk6IHZvaWQge1xuICAgIGNvbnN0IGNhbGNIZWlnaHQgPSB0aGlzLmhlaWdodCAtIHRoaXMuY29udHJvbFRvcDtcblxuICAgIHRoaXMuY29udGV4dC5saW5lV2lkdGggPSAxO1xuICAgIHRoaXMuY29udGV4dC5zdHJva2VTdHlsZSA9ICcjMDBCRkE1JztcbiAgICB0aGlzLmNvbnRleHQuYmVnaW5QYXRoKCk7XG4gICAgdGhpcy5jb250ZXh0Lm1vdmVUbyg0MCwgY2FsY0hlaWdodCAtIDQwKTtcbiAgICB0aGlzLmNvbnRleHQubGluZVRvKDQwLCBjYWxjSGVpZ2h0IC0gMTQwKTtcbiAgICB0aGlzLmNvbnRleHQubGluZVRvKDQ1LCBjYWxjSGVpZ2h0IC0gMTM1KTtcbiAgICB0aGlzLmNvbnRleHQubGluZVRvKDM1LCBjYWxjSGVpZ2h0IC0gMTM1KTtcbiAgICB0aGlzLmNvbnRleHQubGluZVRvKDQwLCBjYWxjSGVpZ2h0IC0gMTQwKTtcbiAgICB0aGlzLmNvbnRleHQuc3Ryb2tlKCk7XG5cbiAgICB0aGlzLmNvbnRleHQubGluZVdpZHRoID0gMTtcbiAgICB0aGlzLmNvbnRleHQuc3Ryb2tlU3R5bGUgPSAnIzAwOTFFQSc7XG4gICAgdGhpcy5jb250ZXh0LmJlZ2luUGF0aCgpO1xuICAgIHRoaXMuY29udGV4dC5tb3ZlVG8oNDAsIGNhbGNIZWlnaHQgLSA0MCk7XG4gICAgdGhpcy5jb250ZXh0LmxpbmVUbygxNDAsIGNhbGNIZWlnaHQgLSA0MCk7XG4gICAgdGhpcy5jb250ZXh0LmxpbmVUbygxMzUsIGNhbGNIZWlnaHQgLSAzNSk7XG4gICAgdGhpcy5jb250ZXh0LmxpbmVUbygxMzUsIGNhbGNIZWlnaHQgLSA0NSk7XG4gICAgdGhpcy5jb250ZXh0LmxpbmVUbygxNDAsIGNhbGNIZWlnaHQgLSA0MCk7XG4gICAgdGhpcy5jb250ZXh0LnN0cm9rZSgpO1xuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcignbW91c2Vkb3duJywgWyckZXZlbnQnXSlcbiAgb25Nb3VzZWRvd24oZXZlbnQpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5pc1Bhbikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBwdCA9IG5ldyBQb2ludChldmVudC5jbGllbnRYIC0gdGhpcy5jb250cm9sTGVmdCwgZXZlbnQuY2xpZW50WSAtIHRoaXMuY29udHJvbFRvcCk7XG4gICAgdGhpcy5zdGF0ZUV2ZW50ID0gZXZlbnQ7XG4gICAgY29uc3Qgc2QgPSBuZXcgU3VyZmFjZURhdGEocHQsIHRoaXMudG9Mb2dpY2FsKHB0KSwgdGhpcywgZXZlbnQsIHRoaXMuc3RhdGVFdmVudCk7XG4gICAgdGhpcy5kb3duLmVtaXQoc2QpO1xuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcignbW91c2Vtb3ZlJywgWyckZXZlbnQnXSlcbiAgb25Nb3VzZW1vdmUoZXZlbnQ6IE1vdXNlRXZlbnQpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5pc1Bhbikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBwdCA9IG5ldyBQb2ludChldmVudC5jbGllbnRYIC0gdGhpcy5jb250cm9sTGVmdCwgZXZlbnQuY2xpZW50WSAtIHRoaXMuY29udHJvbFRvcCk7XG4gICAgY29uc3Qgc2QgPSBuZXcgU3VyZmFjZURhdGEocHQsIHRoaXMudG9Mb2dpY2FsKHB0KSwgdGhpcywgZXZlbnQsIHRoaXMuc3RhdGVFdmVudCk7XG4gICAgdGhpcy5wb2ludGVyUG9zaXRpb24gPSBzZC5tb2RlbFBvaW50O1xuICAgIHRoaXMubW92ZS5lbWl0KHNkKTtcbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ21vdXNldXAnLCBbJyRldmVudCddKVxuICBvbk1vdXNldXAoZXZlbnQ6IE1vdXNlRXZlbnQpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5pc1Bhbikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBwdCA9IG5ldyBQb2ludChldmVudC5jbGllbnRYIC0gdGhpcy5jb250cm9sTGVmdCwgZXZlbnQuY2xpZW50WSAtIHRoaXMuY29udHJvbFRvcCk7XG4gICAgY29uc3Qgc2QgPSBuZXcgU3VyZmFjZURhdGEocHQsIHRoaXMudG9Mb2dpY2FsKHB0KSwgdGhpcywgZXZlbnQsIHRoaXMuc3RhdGVFdmVudCk7XG4gICAgdGhpcy51cC5lbWl0KHNkKTtcbiAgICB0aGlzLnN0YXRlRXZlbnQgPSBldmVudDtcbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCBbJyRldmVudCddKVxuICBwcm90ZWN0ZWQgb25QYW5TdGFydChldmVudCk6IHZvaWQge1xuICAgIGlmIChldmVudC50b3VjaGVzICYmIGV2ZW50LnRvdWNoZXMubGVuZ3RoID4gMCkge1xuICAgICAgdGhpcy5pc1BhbiA9IHRydWU7XG4gICAgICB0aGlzLnN0YXRlRXZlbnQgPSBldmVudDtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBjb25zdCB0b3VjaCA9IGV2ZW50LnRvdWNoZXNbMF07XG4gICAgICBjb25zdCBwdCA9IG5ldyBQb2ludCh0b3VjaC5jbGllbnRYIC0gdGhpcy5jb250cm9sTGVmdCwgdG91Y2guY2xpZW50WSAtIHRoaXMuY29udHJvbFRvcCk7XG4gICAgICBjb25zdCBzZCA9IG5ldyBTdXJmYWNlRGF0YShwdCwgdGhpcy50b0xvZ2ljYWwocHQpLCB0aGlzLCBldmVudCwgdGhpcy5zdGF0ZUV2ZW50KTtcbiAgICAgIHRoaXMuZG93bi5lbWl0KHNkKTtcbiAgICB9XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCd0b3VjaG1vdmUnLCBbJyRldmVudCddKVxuICBwcm90ZWN0ZWQgb25QYW5Nb3ZlKGV2ZW50KTogdm9pZCB7XG4gICAgaWYgKGV2ZW50LnRvdWNoZXMgJiYgZXZlbnQudG91Y2hlcy5sZW5ndGggPiAwKSB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgY29uc3QgdG91Y2ggPSBldmVudC50b3VjaGVzWzBdO1xuICAgICAgY29uc3QgcHQgPSBuZXcgUG9pbnQodG91Y2guY2xpZW50WCAtIHRoaXMuY29udHJvbExlZnQsIHRvdWNoLmNsaWVudFkgLSB0aGlzLmNvbnRyb2xUb3ApO1xuICAgICAgY29uc3Qgc2QgPSBuZXcgU3VyZmFjZURhdGEocHQsIHRoaXMudG9Mb2dpY2FsKHB0KSwgdGhpcywgZXZlbnQsIHRoaXMuc3RhdGVFdmVudCk7XG4gICAgICB0aGlzLm1vdmUuZW1pdChzZCk7XG4gICAgfVxuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcigndG91Y2hlbmQnLCBbJyRldmVudCddKVxuICBwcm90ZWN0ZWQgb25QYW5FbmQoZXZlbnQpOiB2b2lkIHtcbiAgICBpZiAoZXZlbnQuY2hhbmdlZFRvdWNoZXMgJiYgZXZlbnQuY2hhbmdlZFRvdWNoZXMubGVuZ3RoID4gMCkge1xuICAgICAgdGhpcy5pc1BhbiA9IGZhbHNlO1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGNvbnN0IHRvdWNoID0gZXZlbnQuY2hhbmdlZFRvdWNoZXNbMF07XG4gICAgICBjb25zdCBwdCA9IG5ldyBQb2ludCh0b3VjaC5jbGllbnRYIC0gdGhpcy5jb250cm9sTGVmdCwgdG91Y2guY2xpZW50WSAtIHRoaXMuY29udHJvbFRvcCk7XG4gICAgICBjb25zdCBzZCA9IG5ldyBTdXJmYWNlRGF0YShwdCwgdGhpcy50b0xvZ2ljYWwocHQpLCB0aGlzLCBldmVudCwgdGhpcy5zdGF0ZUV2ZW50KTtcbiAgICAgIHRoaXMudXAuZW1pdChzZCk7XG4gICAgICB0aGlzLnN0YXRlRXZlbnQgPSBldmVudDtcbiAgICB9XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCdtb3VzZXdoZWVsJywgWyckZXZlbnQnXSlcbiAgb25Nb3VzZXdoZWVsKGV2ZW50KTogdm9pZCB7XG4gICAgY29uc3QgcHQgPSBuZXcgUG9pbnQoZXZlbnQuY2xpZW50WCAtIHRoaXMuY29udHJvbExlZnQsIGV2ZW50LmNsaWVudFkgLSB0aGlzLmNvbnRyb2xUb3ApO1xuICAgIGNvbnN0IHNkID0gbmV3IFN1cmZhY2VEYXRhKHB0LCB0aGlzLnRvTG9naWNhbChwdCksIHRoaXMsIGV2ZW50LCB0aGlzLnN0YXRlRXZlbnQpO1xuICAgIHRoaXMud2hlZWxSb3RhdGUuZW1pdChzZCk7XG4gIH1cbn1cbiJdfQ==