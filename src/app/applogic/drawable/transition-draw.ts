import { IDrawable, ISurfaceDraw } from 'my-libs/base-draw';
import { TransitionModel } from '../datamodel/transition';
import { StateMachineModel } from '../datamodel/state-machine';

export class TransitionDraw implements IDrawable {
    constructor(private stateMachine: StateMachineModel,
                private transition: TransitionModel,
                private strokeStyle: string = '#F3E5F5') {
    }

    getLayer(): number {
      return 0;
    }

    draw(surface: ISurfaceDraw): void {
      let sourcePos = this.transition.positionSource;
      if (this.transition.sourceStateId >= 0){
        sourcePos = this.stateMachine.states[this.transition.sourceStateId].position;
      }

      let targetPos = this.transition.positionTarget;
      if (this.transition.targetStateId >= 0){
        targetPos = this.stateMachine.states[this.transition.targetStateId].position;
      }

      surface.line(sourcePos.x, sourcePos.y,
        targetPos.x, targetPos.y, this.strokeStyle);
    }
}
