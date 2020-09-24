export declare class ViewControl {
    scale: number;
    offsetX: number;
    offsetY: number;
    width: number;
    height: number;
    switch: boolean;
    zoomIn(): void;
    zoomOut(): void;
    translateXPlus(): void;
    translateXMinus(): void;
    translateYPlus(): void;
    translateYMinus(): void;
    invalidate(): void;
}
