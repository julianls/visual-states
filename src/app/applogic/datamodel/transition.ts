import { Point } from 'my-libs/base-geometry';

export class TransitionModel  {
    public sourceStateId: number;
    public targetStateId: number;
    public positionSource: Point = new Point(0, 0);
    public positionTarget: Point = new Point(0, 0);

    constructor() {
    }
}
