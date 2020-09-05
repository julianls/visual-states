import { StateModel } from './state';
import { TransitionModel } from './transition';

export class StateMachineModel  {
    public id = '';
    public name = '';
    public metadata = '';
    public states: StateModel[] = [];
    public transitions: TransitionModel[] = [];

    constructor() {
    }

    public copyProperties(source: StateMachineModel): void {
        this.id = source.id;
        this.name = source.name;
        this.metadata = source.metadata;
    }
}
