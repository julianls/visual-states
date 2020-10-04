(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('my-libs/base-geometry')) :
    typeof define === 'function' && define.amd ? define('surface-draw', ['exports', '@angular/core', 'my-libs/base-geometry'], factory) :
    (global = global || self, factory(global['surface-draw'] = {}, global.ng.core, global['base-geometry']));
}(this, (function (exports, i0, baseGeometry) { 'use strict';

    var SurfaceData = /** @class */ (function () {
        function SurfaceData(screenPoint, modelPoint, surface, event, stateEvent) {
            this.screenPoint = screenPoint;
            this.modelPoint = modelPoint;
            this.surface = surface;
            this.event = event;
            this.stateEvent = stateEvent;
        }
        return SurfaceData;
    }());

    var ViewControl = /** @class */ (function () {
        function ViewControl() {
            this.scale = 1.0;
            this.offsetX = 0.0;
            this.offsetY = 0.0;
            this.width = 0.0;
            this.height = 0.0;
            this.switch = false;
        }
        ViewControl.prototype.zoomIn = function () {
            this.scale /= 0.80;
        };
        ViewControl.prototype.zoomOut = function () {
            this.scale *= 0.80;
        };
        ViewControl.prototype.translateXPlus = function () {
            this.offsetX += 25;
        };
        ViewControl.prototype.translateXMinus = function () {
            this.offsetX -= 25;
        };
        ViewControl.prototype.translateYPlus = function () {
            this.offsetY += 25;
        };
        ViewControl.prototype.translateYMinus = function () {
            this.offsetY -= 25;
        };
        ViewControl.prototype.invalidate = function () {
            this.switch = !this.switch;
        };
        return ViewControl;
    }());

    var SurfaceDrawService = /** @class */ (function () {
        function SurfaceDrawService() {
        }
        return SurfaceDrawService;
    }());
    SurfaceDrawService.ɵfac = function SurfaceDrawService_Factory(t) { return new (t || SurfaceDrawService)(); };
    SurfaceDrawService.ɵprov = i0.ɵɵdefineInjectable({ token: SurfaceDrawService, factory: SurfaceDrawService.ɵfac, providedIn: 'root' });
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(SurfaceDrawService, [{
                type: i0.Injectable,
                args: [{
                        providedIn: 'root'
                    }]
            }], function () { return []; }, null);
    })();

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise */
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b)
                if (Object.prototype.hasOwnProperty.call(b, p))
                    d[p] = b[p]; };
        return extendStatics(d, b);
    };
    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }
    var __assign = function () {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s)
                    if (Object.prototype.hasOwnProperty.call(s, p))
                        t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };
    function __rest(s, e) {
        var t = {};
        for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
                t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }
    function __decorate(decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
            r = Reflect.decorate(decorators, target, key, desc);
        else
            for (var i = decorators.length - 1; i >= 0; i--)
                if (d = decorators[i])
                    r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    }
    function __param(paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); };
    }
    function __metadata(metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
            return Reflect.metadata(metadataKey, metadataValue);
    }
    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try {
                step(generator.next(value));
            }
            catch (e) {
                reject(e);
            } }
            function rejected(value) { try {
                step(generator["throw"](value));
            }
            catch (e) {
                reject(e);
            } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }
    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function () { if (t[0] & 1)
                throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function () { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f)
                throw new TypeError("Generator is already executing.");
            while (_)
                try {
                    if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
                        return t;
                    if (y = 0, t)
                        op = [op[0] & 2, t.value];
                    switch (op[0]) {
                        case 0:
                        case 1:
                            t = op;
                            break;
                        case 4:
                            _.label++;
                            return { value: op[1], done: false };
                        case 5:
                            _.label++;
                            y = op[1];
                            op = [0];
                            continue;
                        case 7:
                            op = _.ops.pop();
                            _.trys.pop();
                            continue;
                        default:
                            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                                _ = 0;
                                continue;
                            }
                            if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                                _.label = op[1];
                                break;
                            }
                            if (op[0] === 6 && _.label < t[1]) {
                                _.label = t[1];
                                t = op;
                                break;
                            }
                            if (t && _.label < t[2]) {
                                _.label = t[2];
                                _.ops.push(op);
                                break;
                            }
                            if (t[2])
                                _.ops.pop();
                            _.trys.pop();
                            continue;
                    }
                    op = body.call(thisArg, _);
                }
                catch (e) {
                    op = [6, e];
                    y = 0;
                }
                finally {
                    f = t = 0;
                }
            if (op[0] & 5)
                throw op[1];
            return { value: op[0] ? op[1] : void 0, done: true };
        }
    }
    var __createBinding = Object.create ? (function (o, m, k, k2) {
        if (k2 === undefined)
            k2 = k;
        Object.defineProperty(o, k2, { enumerable: true, get: function () { return m[k]; } });
    }) : (function (o, m, k, k2) {
        if (k2 === undefined)
            k2 = k;
        o[k2] = m[k];
    });
    function __exportStar(m, o) {
        for (var p in m)
            if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p))
                __createBinding(o, m, p);
    }
    function __values(o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m)
            return m.call(o);
        if (o && typeof o.length === "number")
            return {
                next: function () {
                    if (o && i >= o.length)
                        o = void 0;
                    return { value: o && o[i++], done: !o };
                }
            };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    }
    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m)
            return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
                ar.push(r.value);
        }
        catch (error) {
            e = { error: error };
        }
        finally {
            try {
                if (r && !r.done && (m = i["return"]))
                    m.call(i);
            }
            finally {
                if (e)
                    throw e.error;
            }
        }
        return ar;
    }
    function __spread() {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    }
    function __spreadArrays() {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++)
            s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    }
    ;
    function __await(v) {
        return this instanceof __await ? (this.v = v, this) : new __await(v);
    }
    function __asyncGenerator(thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator)
            throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
        function verb(n) { if (g[n])
            i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
        function resume(n, v) { try {
            step(g[n](v));
        }
        catch (e) {
            settle(q[0][3], e);
        } }
        function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
        function fulfill(value) { resume("next", value); }
        function reject(value) { resume("throw", value); }
        function settle(f, v) { if (f(v), q.shift(), q.length)
            resume(q[0][0], q[0][1]); }
    }
    function __asyncDelegator(o) {
        var i, p;
        return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
        function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
    }
    function __asyncValues(o) {
        if (!Symbol.asyncIterator)
            throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator], i;
        return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
        function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
        function settle(resolve, reject, d, v) { Promise.resolve(v).then(function (v) { resolve({ value: v, done: d }); }, reject); }
    }
    function __makeTemplateObject(cooked, raw) {
        if (Object.defineProperty) {
            Object.defineProperty(cooked, "raw", { value: raw });
        }
        else {
            cooked.raw = raw;
        }
        return cooked;
    }
    ;
    var __setModuleDefault = Object.create ? (function (o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function (o, v) {
        o["default"] = v;
    };
    function __importStar(mod) {
        if (mod && mod.__esModule)
            return mod;
        var result = {};
        if (mod != null)
            for (var k in mod)
                if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
                    __createBinding(result, mod, k);
        __setModuleDefault(result, mod);
        return result;
    }
    function __importDefault(mod) {
        return (mod && mod.__esModule) ? mod : { default: mod };
    }
    function __classPrivateFieldGet(receiver, privateMap) {
        if (!privateMap.has(receiver)) {
            throw new TypeError("attempted to get private field on non-instance");
        }
        return privateMap.get(receiver);
    }
    function __classPrivateFieldSet(receiver, privateMap, value) {
        if (!privateMap.has(receiver)) {
            throw new TypeError("attempted to set private field on non-instance");
        }
        privateMap.set(receiver, value);
        return value;
    }

    var _c0 = ["myCanvas"];
    var _c1 = ["divElement"];
    var SurfaceDrawComponent = /** @class */ (function () {
        function SurfaceDrawComponent() {
            this.scaleValue = 1;
            this.offsetXValue = 0;
            this.offsetYValue = 0;
            this.widthValue = 0;
            this.heightValue = 0;
            this.switchValue = false;
            this.drawAxises = false;
            this.scaleChange = new i0.EventEmitter();
            this.offsetXChange = new i0.EventEmitter();
            this.offsetYChange = new i0.EventEmitter();
            this.widthChange = new i0.EventEmitter();
            this.heightChange = new i0.EventEmitter();
            this.center = new baseGeometry.Point(0, 0);
            this.pointerPosition = new baseGeometry.Point(0, 0);
            this.canvasValid = false;
            // private lastRefreshHandle: number;
            // private cancelRefreshCounter: number = 0;
            this.isPan = false;
            this.down = new i0.EventEmitter();
            this.move = new i0.EventEmitter();
            this.up = new i0.EventEmitter();
            this.wheelRotate = new i0.EventEmitter();
            // @Output() click: EventEmitter<Point> = new EventEmitter<Point>();
            this.stateEvent = null;
        }
        Object.defineProperty(SurfaceDrawComponent.prototype, "scale", {
            get: function () {
                return this.scaleValue;
            },
            set: function (val) {
                if (this.scaleValue !== val) {
                    this.scaleValue = val;
                    this.scaleChange.emit(this.scaleValue);
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SurfaceDrawComponent.prototype, "offsetX", {
            get: function () {
                return this.offsetXValue;
            },
            set: function (val) {
                if (this.offsetXValue !== val) {
                    this.offsetXValue = val;
                    this.offsetXChange.emit(this.offsetXValue);
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SurfaceDrawComponent.prototype, "offsetY", {
            get: function () {
                return this.offsetYValue;
            },
            set: function (val) {
                if (this.offsetXValue !== val) {
                    this.offsetYValue = val;
                    this.offsetYChange.emit(this.offsetYValue);
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SurfaceDrawComponent.prototype, "width", {
            get: function () {
                return this.widthValue;
            },
            set: function (val) {
                if (this.widthValue !== val) {
                    this.widthValue = val;
                    this.widthChange.emit(this.widthValue);
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SurfaceDrawComponent.prototype, "height", {
            get: function () {
                return this.heightValue;
            },
            set: function (val) {
                if (this.heightValue !== val) {
                    this.heightValue = val;
                    this.heightChange.emit(this.heightValue);
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SurfaceDrawComponent.prototype, "switch", {
            get: function () {
                return this.switchValue;
            },
            set: function (val) {
                if (this.switchValue !== val) {
                    this.switchValue = val;
                    this.invalidateDrawing();
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SurfaceDrawComponent.prototype, "mousePosition", {
            get: function () {
                return this.pointerPosition;
            },
            enumerable: false,
            configurable: true
        });
        SurfaceDrawComponent.prototype.ngOnInit = function () {
            this.offscreenCanvas = document.createElement('canvas');
            this.canvasValid = true;
        };
        SurfaceDrawComponent.prototype.ngAfterViewInit = function () {
            var _this = this;
            // this.context = this.canvasRef.nativeElement.getContext('2d');
            this.context = this.offscreenCanvas.getContext('2d', { alpha: false });
            window.onresize = this.resizeCanvas.bind(this);
            requestAnimationFrame(function () { return _this.resizeCanvas(_this.divElement); });
        };
        SurfaceDrawComponent.prototype.resizeCanvas = function (_) {
            var el = this.divElement.nativeElement;
            this.width = el.clientWidth;
            this.height = el.clientHeight;
            this.offscreenCanvas.width = this.width;
            this.offscreenCanvas.height = this.height;
            this.canvasRef.nativeElement.width = el.clientWidth;
            this.canvasRef.nativeElement.height = el.clientHeight;
            this.invalidateDrawing();
        };
        SurfaceDrawComponent.prototype.ngOnChanges = function () {
            // this.context = this.canvasRef.nativeElement.getContext('2d');
            if (this.offscreenCanvas) {
                this.context = this.offscreenCanvas.getContext('2d', { alpha: false });
                this.invalidateDrawing();
            }
        };
        SurfaceDrawComponent.prototype.invalidateDrawing = function () {
            var _this = this;
            if (this.canvasValid) {
                this.canvasValid = false;
                // this.cancelRefreshCounter++;
                // if (this.cancelRefreshCounter < 10)
                //  cancelAnimationFrame(this.lastRefreshHandle);
                // else
                //  this.cancelRefreshCounter = 0;
                // this.lastRefreshHandle = requestAnimationFrame(() => this.drawOffscreen());
                requestAnimationFrame(function () { return _this.drawOffscreen(); });
            }
        };
        SurfaceDrawComponent.prototype.line = function (x1, y1, x2, y2, strokeStyle) {
            if (strokeStyle === void 0) { strokeStyle = '#F3E5F5'; }
            this.context.strokeStyle = strokeStyle;
            this.context.beginPath();
            this.context.moveTo(this.toDeviceX(x1), this.toDeviceY(y1));
            this.context.lineTo(this.toDeviceX(x2), this.toDeviceY(y2));
            this.context.stroke();
        };
        SurfaceDrawComponent.prototype.polyline = function (points, strokeStyle) {
            if (strokeStyle === void 0) { strokeStyle = '#F3E5F5'; }
            this.context.strokeStyle = strokeStyle;
            this.context.beginPath();
            for (var i = 0; i < points.length; i++) {
                if (i === 0) {
                    this.context.moveTo(this.toDeviceX(points[i].x), this.toDeviceY(points[i].y));
                }
                else {
                    this.context.lineTo(this.toDeviceX(points[i].x), this.toDeviceY(points[i].y));
                }
            }
            this.context.stroke();
        };
        SurfaceDrawComponent.prototype.polygon = function (points, strokeStyle, fillStyle) {
            if (strokeStyle === void 0) { strokeStyle = '#F3E5F5'; }
            this.context.strokeStyle = strokeStyle;
            this.context.beginPath();
            for (var i = 0; i < points.length; i++) {
                if (i === 0) {
                    this.context.moveTo(this.toDeviceX(points[i].x), this.toDeviceY(points[i].y));
                }
                else {
                    this.context.lineTo(this.toDeviceX(points[i].x), this.toDeviceY(points[i].y));
                }
            }
            this.context.closePath();
            if (fillStyle) {
                var oldFill = this.context.fillStyle;
                this.context.fillStyle = fillStyle;
                this.context.fill();
                this.context.fillStyle = oldFill;
            }
            this.context.stroke();
        };
        SurfaceDrawComponent.prototype.bezierCurve = function (x1, y1, cp1x, cp1y, cp2x, cp2y, x2, y2, strokeStyle) {
            if (strokeStyle === void 0) { strokeStyle = '#F3E5F5'; }
            this.context.strokeStyle = strokeStyle;
            this.context.beginPath();
            this.context.moveTo(this.toDeviceX(x1), this.toDeviceY(y1));
            this.context.bezierCurveTo(this.toDeviceX(cp1x), this.toDeviceY(cp1y), this.toDeviceX(cp2x), this.toDeviceY(cp2y), this.toDeviceX(x2), this.toDeviceY(y2));
            this.context.stroke();
        };
        SurfaceDrawComponent.prototype.rect = function (x1, y1, w, h, strokeStyle) {
            if (strokeStyle === void 0) { strokeStyle = '#F3E5F5'; }
            this.context.strokeStyle = strokeStyle;
            var width = this.toDeviceScale(w);
            var height = this.toDeviceScale(h);
            this.context.strokeRect(this.toDeviceX(x1), this.toDeviceY(y1) - height, width, height);
        };
        SurfaceDrawComponent.prototype.text = function (text, x, y, font, strokeStyle) {
            if (font === void 0) { font = null; }
            if (strokeStyle === void 0) { strokeStyle = '#F3E5F5'; }
            x = this.toDeviceX(x);
            y = this.toDeviceY(y);
            /// color for background
            this.context.fillStyle = '#303030';
            /// get width of text
            var oldFont = this.context.font;
            if (font) {
                this.context.font = font;
            }
            var width = this.context.measureText(text).width;
            /// draw background rect assuming height of font
            this.context.fillRect(x - width / 2.0, y - 6, width, 12);
            this.context.fillStyle = strokeStyle;
            this.context.textBaseline = 'middle';
            this.context.textAlign = 'center';
            this.context.fillText(text, x, y, width);
            if (font) {
                this.context.font = oldFont;
            }
        };
        SurfaceDrawComponent.prototype.image = function (img, x, y, width, height, scale) {
            x = this.toDeviceX(x);
            y = this.toDeviceY(y);
            width = this.toDeviceScale(width * scale);
            height = this.toDeviceScale(height * scale);
            this.context.drawImage(img, 0, 0, img.width, img.height, x, y - height, width, height);
        };
        SurfaceDrawComponent.prototype.fromDeviceScale = function (val) {
            return val / this.scale;
        };
        SurfaceDrawComponent.prototype.toDeviceScale = function (val) {
            return val * this.scale;
        };
        SurfaceDrawComponent.prototype.toDeviceX = function (val) {
            return this.center.x +
                this.toDeviceScale(this.offsetX) +
                this.toDeviceScale(val);
        };
        SurfaceDrawComponent.prototype.toDeviceY = function (val) {
            return this.center.y -
                this.toDeviceScale(this.offsetY) -
                this.toDeviceScale(val);
        };
        SurfaceDrawComponent.prototype.getCenter = function () {
            var el = this.divElement.nativeElement;
            var centerX = el.clientWidth / 2.0 - el.offsetLeft / 2.0;
            var centerY = el.clientHeight / 2.0 - el.offsetTop / 2.0;
            return new baseGeometry.Point(centerX, centerY);
        };
        SurfaceDrawComponent.prototype.drawData = function () {
            if (this.offscreenCanvas.width > 0 && this.offscreenCanvas.height > 0) {
                var ctx = this.canvasRef.nativeElement.getContext('2d', { alpha: false });
                ctx.clearRect(0, 0, this.width, this.height);
                ctx.drawImage(this.offscreenCanvas, 0, 0);
            }
        };
        SurfaceDrawComponent.prototype.drawOffscreen = function () {
            var e_1, _a, e_2, _b;
            var _this = this;
            if (!this.canvasValid) {
                this.canvasValid = true;
                this.center = this.getCenter();
                this.context.lineWidth = 1;
                this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
                this.context.fillStyle = '#303030';
                this.context.fillRect(0, 0, this.context.canvas.width, this.context.canvas.height);
                if (this.drawItems != null) {
                    try {
                        for (var _c = __values(this.drawItems), _d = _c.next(); !_d.done; _d = _c.next()) {
                            var entry = _d.value;
                            if (entry.getLayer() < 0) {
                                entry.draw(this);
                            }
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                }
                this.drawGrid();
                if (this.drawItems != null) {
                    try {
                        for (var _e = __values(this.drawItems), _f = _e.next(); !_f.done; _f = _e.next()) {
                            var entry = _f.value;
                            if (entry.getLayer() >= 0) {
                                entry.draw(this);
                            }
                        }
                    }
                    catch (e_2_1) { e_2 = { error: e_2_1 }; }
                    finally {
                        try {
                            if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
                        }
                        finally { if (e_2) throw e_2.error; }
                    }
                }
                this.drawVerticalRuler();
                this.drawHorizontalRuler();
                requestAnimationFrame(function () { return _this.drawData(); });
            }
        };
        SurfaceDrawComponent.prototype.toLogical = function (point) {
            var result = new baseGeometry.Point(point.x, point.y);
            result.x = this.fromDeviceScale(point.x) -
                this.offsetX -
                this.fromDeviceScale(this.center.x);
            result.y = -(this.fromDeviceScale(point.y - this.center.y) + this.offsetY);
            return result;
        };
        SurfaceDrawComponent.prototype.drawHorizontalRuler = function () {
            var center = new baseGeometry.Point(this.center.x, this.center.y);
            center.x += this.toDeviceScale(this.offsetX);
            center.y -= this.toDeviceScale(this.offsetY);
            var step = this.toDeviceScale(10);
            while (step < 5) {
                step /= 0.40;
            }
            while (step > 15) {
                step *= 0.40;
            }
            this.context.lineWidth = 0.25;
            this.context.strokeStyle = '#FFFFFF';
            this.context.beginPath();
            var len = 10;
            var cnt = 0;
            for (var x = center.x; x >= 0; x -= step) {
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
            for (var x = center.x + step; x <= this.context.canvas.width; x += step) {
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
        };
        SurfaceDrawComponent.prototype.drawVerticalRuler = function () {
            var center = new baseGeometry.Point(this.center.x, this.center.y);
            center.x += this.toDeviceScale(this.offsetX);
            center.y -= this.toDeviceScale(this.offsetY);
            var step = this.toDeviceScale(10);
            while (step < 5) {
                step /= 0.40;
            }
            while (step > 15) {
                step *= 0.40;
            }
            this.context.lineWidth = 0.25;
            this.context.strokeStyle = '#FFFFFF';
            this.context.beginPath();
            var len = 10;
            var cnt = 0;
            for (var y = center.y; y >= 0; y -= step) {
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
            for (var y = center.y + step; y <= this.context.canvas.height; y += step) {
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
        };
        SurfaceDrawComponent.prototype.drawRulerText = function (x, y, horizontal) {
            var logicalPt = this.toLogical(new baseGeometry.Point(x, y));
            var text = horizontal ? Math.round(logicalPt.x).toString() : Math.round(logicalPt.y).toString();
            ///// color for background
            // this.context.fillStyle = '#303030';
            ///// get width of text
            var width = this.context.measureText(text).width;
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
        };
        SurfaceDrawComponent.prototype.drawGrid = function () {
            var center = new baseGeometry.Point(this.center.x, this.center.y);
            center.x += this.toDeviceScale(this.offsetX);
            center.y -= this.toDeviceScale(this.offsetY);
            var step = this.toDeviceScale(10);
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
            for (var x = center.x; x >= 0; x -= step) {
                this.context.moveTo(x, 0);
                this.context.lineTo(x, this.context.canvas.height);
            }
            for (var x = center.x + step; x <= this.context.canvas.width; x += step) {
                this.context.moveTo(x, 0);
                this.context.lineTo(x, this.context.canvas.height);
            }
            for (var y = center.y; y >= 0; y -= step) {
                this.context.moveTo(0, y);
                this.context.lineTo(this.context.canvas.width, y);
            }
            for (var y = center.y + step; y <= this.context.canvas.height; y += step) {
                this.context.moveTo(0, y);
                this.context.lineTo(this.context.canvas.width, y);
            }
            this.context.closePath();
            this.context.stroke();
            step = step * 5;
            this.context.lineWidth = 0.5;
            this.context.strokeStyle = '#3C3C3C';
            this.context.beginPath();
            var hw = 0.5;
            var w = 1;
            for (var x = center.x; x >= 0; x -= step) {
                for (var y = center.y; y >= 0; y -= step) {
                    this.context.strokeRect(x - hw, y - hw, w, w);
                }
                for (var y = center.y + step; y <= this.context.canvas.height; y += step) {
                    this.context.strokeRect(x - hw, y - hw, w, w);
                }
            }
            for (var x = center.x + step; x <= this.context.canvas.width; x += step) {
                for (var y = center.y; y >= 0; y -= step) {
                    this.context.strokeRect(x - hw, y - hw, w, w);
                }
                for (var y = center.y + step; y <= this.context.canvas.height; y += step) {
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
        };
        SurfaceDrawComponent.prototype.drawCoordinateSystem = function () {
            var calcHeight = this.height - this.divElement.nativeElement.offsetTop;
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
        };
        SurfaceDrawComponent.prototype.onMousedown = function (event) {
            if (this.isPan) {
                return;
            }
            var pt = new baseGeometry.Point(event.clientX, event.clientY - this.divElement.nativeElement.offsetTop);
            this.stateEvent = event;
            var sd = new SurfaceData(pt, this.toLogical(pt), this, event, this.stateEvent);
            this.down.emit(sd);
        };
        SurfaceDrawComponent.prototype.onMousemove = function (event) {
            if (this.isPan) {
                return;
            }
            var pt = new baseGeometry.Point(event.clientX, event.clientY - this.divElement.nativeElement.offsetTop);
            var sd = new SurfaceData(pt, this.toLogical(pt), this, event, this.stateEvent);
            this.pointerPosition = sd.modelPoint;
            this.move.emit(sd);
        };
        SurfaceDrawComponent.prototype.onMouseup = function (event) {
            if (this.isPan) {
                return;
            }
            var pt = new baseGeometry.Point(event.clientX, event.clientY - this.divElement.nativeElement.offsetTop);
            var sd = new SurfaceData(pt, this.toLogical(pt), this, event, this.stateEvent);
            this.up.emit(sd);
            this.stateEvent = event;
        };
        SurfaceDrawComponent.prototype.onPanStart = function (event) {
            if (event.touches && event.touches.length > 0) {
                this.isPan = true;
                this.stateEvent = event;
                event.preventDefault();
                var touch = event.touches[0];
                var pt = new baseGeometry.Point(touch.clientX, touch.clientY - this.divElement.nativeElement.offsetTop);
                var sd = new SurfaceData(pt, this.toLogical(pt), this, event, this.stateEvent);
                this.down.emit(sd);
            }
        };
        SurfaceDrawComponent.prototype.onPanMove = function (event) {
            if (event.touches && event.touches.length > 0) {
                event.preventDefault();
                var touch = event.touches[0];
                var pt = new baseGeometry.Point(touch.clientX, touch.clientY - this.divElement.nativeElement.offsetTop);
                var sd = new SurfaceData(pt, this.toLogical(pt), this, event, this.stateEvent);
                this.move.emit(sd);
            }
        };
        SurfaceDrawComponent.prototype.onPanEnd = function (event) {
            if (event.changedTouches && event.changedTouches.length > 0) {
                this.isPan = false;
                event.preventDefault();
                var touch = event.changedTouches[0];
                var pt = new baseGeometry.Point(touch.clientX, touch.clientY - this.divElement.nativeElement.offsetTop);
                var sd = new SurfaceData(pt, this.toLogical(pt), this, event, this.stateEvent);
                this.up.emit(sd);
                this.stateEvent = event;
            }
        };
        SurfaceDrawComponent.prototype.onMousewheel = function (event) {
            var pt = new baseGeometry.Point(event.clientX, event.clientY - this.divElement.nativeElement.offsetTop);
            var sd = new SurfaceData(pt, this.toLogical(pt), this, event, this.stateEvent);
            this.wheelRotate.emit(sd);
        };
        return SurfaceDrawComponent;
    }());
    SurfaceDrawComponent.ɵfac = function SurfaceDrawComponent_Factory(t) { return new (t || SurfaceDrawComponent)(); };
    SurfaceDrawComponent.ɵcmp = i0.ɵɵdefineComponent({ type: SurfaceDrawComponent, selectors: [["lib-surface-draw"]], viewQuery: function SurfaceDrawComponent_Query(rf, ctx) {
            if (rf & 1) {
                i0.ɵɵstaticViewQuery(_c0, true);
                i0.ɵɵstaticViewQuery(_c1, true);
            }
            if (rf & 2) {
                var _t;
                i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.canvasRef = _t.first);
                i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.divElement = _t.first);
            }
        }, hostBindings: function SurfaceDrawComponent_HostBindings(rf, ctx) {
            if (rf & 1) {
                i0.ɵɵlistener("mousedown", function SurfaceDrawComponent_mousedown_HostBindingHandler($event) { return ctx.onMousedown($event); })("mousemove", function SurfaceDrawComponent_mousemove_HostBindingHandler($event) { return ctx.onMousemove($event); })("mouseup", function SurfaceDrawComponent_mouseup_HostBindingHandler($event) { return ctx.onMouseup($event); })("touchstart", function SurfaceDrawComponent_touchstart_HostBindingHandler($event) { return ctx.onPanStart($event); })("touchmove", function SurfaceDrawComponent_touchmove_HostBindingHandler($event) { return ctx.onPanMove($event); })("touchend", function SurfaceDrawComponent_touchend_HostBindingHandler($event) { return ctx.onPanEnd($event); })("mousewheel", function SurfaceDrawComponent_mousewheel_HostBindingHandler($event) { return ctx.onMousewheel($event); });
            }
        }, inputs: { drawItems: "drawItems", drawAxises: "drawAxises", scale: "scale", offsetX: "offsetX", offsetY: "offsetY", width: "width", height: "height", switch: "switch" }, outputs: { scaleChange: "scaleChange", offsetXChange: "offsetXChange", offsetYChange: "offsetYChange", widthChange: "widthChange", heightChange: "heightChange", down: "down", move: "move", up: "up", wheelRotate: "wheelRotate" }, features: [i0.ɵɵNgOnChangesFeature], decls: 4, vars: 0, consts: [[1, "div-root"], ["divElement", ""], [1, "canvas-main"], ["myCanvas", ""]], template: function SurfaceDrawComponent_Template(rf, ctx) {
            if (rf & 1) {
                i0.ɵɵelementStart(0, "div", 0, 1);
                i0.ɵɵelement(2, "canvas", 2, 3);
                i0.ɵɵelementEnd();
            }
        }, styles: [".canvas-main[_ngcontent-%COMP%] {\n    touch-action: none !important;\n  }\n\n  .div-root[_ngcontent-%COMP%] {\n    position: fixed;\n    width: 100%;\n    height: 100%;\n  }"] });
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(SurfaceDrawComponent, [{
                type: i0.Component,
                args: [{
                        selector: 'lib-surface-draw',
                        template: "\n  <div #divElement class=\"div-root\">\n    <canvas #myCanvas class=\"canvas-main\">\n    </canvas>\n  </div>\n  ",
                        styles: ["\n  .canvas-main {\n    touch-action: none !important;\n  }\n\n  .div-root {\n    position: fixed;\n    width: 100%;\n    height: 100%;\n  }\n  "]
                    }]
            }], function () { return []; }, { canvasRef: [{
                    type: i0.ViewChild,
                    args: ['myCanvas', { static: true }]
                }], divElement: [{
                    type: i0.ViewChild,
                    args: ['divElement', { static: true }]
                }], drawItems: [{
                    type: i0.Input
                }], drawAxises: [{
                    type: i0.Input
                }], scaleChange: [{
                    type: i0.Output
                }], offsetXChange: [{
                    type: i0.Output
                }], offsetYChange: [{
                    type: i0.Output
                }], widthChange: [{
                    type: i0.Output
                }], heightChange: [{
                    type: i0.Output
                }], down: [{
                    type: i0.Output
                }], move: [{
                    type: i0.Output
                }], up: [{
                    type: i0.Output
                }], wheelRotate: [{
                    type: i0.Output
                }], scale: [{
                    type: i0.Input
                }], offsetX: [{
                    type: i0.Input
                }], offsetY: [{
                    type: i0.Input
                }], width: [{
                    type: i0.Input
                }], height: [{
                    type: i0.Input
                }], switch: [{
                    type: i0.Input
                }], onMousedown: [{
                    type: i0.HostListener,
                    args: ['mousedown', ['$event']]
                }], onMousemove: [{
                    type: i0.HostListener,
                    args: ['mousemove', ['$event']]
                }], onMouseup: [{
                    type: i0.HostListener,
                    args: ['mouseup', ['$event']]
                }], onPanStart: [{
                    type: i0.HostListener,
                    args: ['touchstart', ['$event']]
                }], onPanMove: [{
                    type: i0.HostListener,
                    args: ['touchmove', ['$event']]
                }], onPanEnd: [{
                    type: i0.HostListener,
                    args: ['touchend', ['$event']]
                }], onMousewheel: [{
                    type: i0.HostListener,
                    args: ['mousewheel', ['$event']]
                }] });
    })();

    var SurfaceDrawModule = /** @class */ (function () {
        function SurfaceDrawModule() {
        }
        return SurfaceDrawModule;
    }());
    SurfaceDrawModule.ɵmod = i0.ɵɵdefineNgModule({ type: SurfaceDrawModule });
    SurfaceDrawModule.ɵinj = i0.ɵɵdefineInjector({ factory: function SurfaceDrawModule_Factory(t) { return new (t || SurfaceDrawModule)(); }, imports: [[]] });
    (function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(SurfaceDrawModule, { declarations: [SurfaceDrawComponent], exports: [SurfaceDrawComponent] }); })();
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(SurfaceDrawModule, [{
                type: i0.NgModule,
                args: [{
                        declarations: [SurfaceDrawComponent],
                        imports: [],
                        exports: [SurfaceDrawComponent]
                    }]
            }], null, null);
    })();

    /*
     * Public API Surface of surface-draw
     */

    /**
     * Generated bundle index. Do not edit.
     */

    exports.SurfaceData = SurfaceData;
    exports.SurfaceDrawComponent = SurfaceDrawComponent;
    exports.SurfaceDrawModule = SurfaceDrawModule;
    exports.SurfaceDrawService = SurfaceDrawService;
    exports.ViewControl = ViewControl;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=surface-draw.umd.js.map
