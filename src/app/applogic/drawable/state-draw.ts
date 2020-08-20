import { IDrawable, ISurfaceDraw } from 'my-libs/base-draw';
import { TransitionModel } from '../datamodel/transition';
import { StateMachineModel } from '../datamodel/state-machine';

export class StateDraw implements IDrawable {
    constructor(private stateMachine: StateMachineModel,
                private transition: TransitionModel,
                private strokeStyle: string = '#F3E5F5') {
    }

    getLayer(): number {
      return 0;
    }

    draw(surface: ISurfaceDraw): void {
    //   surface.line(this.line.first.x, this.line.first.y,
    //     this.line.second.x, this.line.second.y, this.strokeStyle);
    }
}
