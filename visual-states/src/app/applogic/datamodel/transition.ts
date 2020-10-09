import { Point } from 'my-libs/base-geometry';

export class TransitionModel  {
    public id = '';
    public trigger = '';
    public metadata = '';
    public sourceStateId = '';
    public targetStateId = '';
    public positionSource: Point = new Point(0, 0);
    public positionTarget: Point = new Point(0, 0);
    public condition = '';
    public actions = '';

    public editState = 0;

    constructor() {
    }

    public copyProperties(source: TransitionModel): void {
        this.id = source.id;
        this.trigger = source.trigger;
        this.metadata = source.metadata;
        this.sourceStateId = source.sourceStateId;
        this.targetStateId = source.targetStateId;
        this.positionSource = source.positionSource;
        this.positionTarget = source.positionTarget;
        this.condition = source.condition;
        this.actions = source.actions;
    }
}
