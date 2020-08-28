import { Point } from 'my-libs/base-geometry';

export class TransitionModel  {
    public id: string;
    public sourceStateId: number;
    public targetStateId: number;
    public positionSource: Point = new Point(0, 0);
    public positionTarget: Point = new Point(0, 0);
    public condition: string;
    public actions: string[] = [];

    public editState = 0;

    constructor() {
    }
}
