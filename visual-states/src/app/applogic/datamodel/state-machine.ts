import { StateModel } from './state';
import { TransitionModel } from './transition';

export class StateMachineModel extends StateModel  {
    constructor() {
        super();
    }

    public copyProperties(source: StateMachineModel): void {
        super.copyProperties(source);
    }
}
