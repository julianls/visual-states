import { StateModel } from './state';
import { TransitionModel } from './transition';

export class StateMachineModel  {
    public states: StateModel[] = [];
    public transitions: TransitionModel[] = [];

    constructor() {
    }
}
