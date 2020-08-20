import { IDrawable, ISurfaceDraw } from 'my-libs/base-draw';
import { StateModel } from '../datamodel/state';
import { StateMachineModel } from '../datamodel/state-machine';

export class TransitionDraw implements IDrawable {
    constructor(private stateMachine: StateMachineModel,
                private state: StateModel,
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
