import * as i0 from '@angular/core';
import { Injectable, EventEmitter, Component, ViewChild, Input, Output, HostListener, NgModule } from '@angular/core';
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
SurfaceDrawService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.1", ngImport: i0, type: SurfaceDrawService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
SurfaceDrawService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.0.1", ngImport: i0, type: SurfaceDrawService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.1", ngImport: i0, type: SurfaceDrawService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: function () { return []; } });

class SurfaceDrawComponent {
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

class SurfaceDrawModule {
}
SurfaceDrawModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.1", ngImport: i0, type: SurfaceDrawModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
SurfaceDrawModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.0.1", ngImport: i0, type: SurfaceDrawModule, declarations: [SurfaceDrawComponent], exports: [SurfaceDrawComponent] });
SurfaceDrawModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.0.1", ngImport: i0, type: SurfaceDrawModule, imports: [[]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.1", ngImport: i0, type: SurfaceDrawModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [SurfaceDrawComponent],
                    imports: [],
                    exports: [SurfaceDrawComponent]
                }]
        }] });

/*
 * Public API Surface of surface-draw
 */

/**
 * Generated bundle index. Do not edit.
 */

export { SurfaceData, SurfaceDrawComponent, SurfaceDrawModule, SurfaceDrawService, ViewControl };
//# sourceMappingURL=surface-draw.mjs.map
