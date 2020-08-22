import { IDrawable, ISurfaceDraw } from 'my-libs/base-draw';
import { StateModel } from '../datamodel/state';
import { StateMachineModel } from '../datamodel/state-machine';

export class StateDraw implements IDrawable {
    constructor(private stateMachine: StateMachineModel,
                private state: StateModel,
                private strokeStyle: string = '#F3E5F5') {
    }

    getLayer(): number {
      return 0;
    }

    draw(surface: ISurfaceDraw): void {
      surface.rect(this.state.position.x - 75, this.state.position.y - 50,
                   150, 100, this.strokeStyle);
    }
}
