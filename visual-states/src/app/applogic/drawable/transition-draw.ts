import { IDrawable, ISurfaceDraw } from 'my-libs/base-draw';
import { TransitionModel } from '../datamodel/transition';
import { CommandsData } from '../statemachine/commands/command-data';

export class TransitionDraw implements IDrawable {
    constructor(private commandsData: CommandsData,
                private transition: TransitionModel,
                private strokeStyle: string = '#F3E5F5',
                private selectedStrokeStyle: string = '#23D18B') {
    }

    getLayer(): number {
      return 0;
    }

    draw(surface: ISurfaceDraw): void {
      const isSelected = this.commandsData.selectedItems.transitions.indexOf(this.transition) >= 0;

      let sourcePos = this.transition.positionSource;
      if (this.transition.sourceStateId && this.transition.sourceStateId.length > 0){
        sourcePos = this.commandsData.activeRoot.findStateById(this.transition.sourceStateId).position;
      }

      let targetPos = this.transition.positionTarget;
      if (this.transition.targetStateId && this.transition.targetStateId.length > 0){
        targetPos = this.commandsData.activeRoot.findStateById(this.transition.targetStateId).position;
      }

      surface.line(sourcePos.x, sourcePos.y,
        targetPos.x, targetPos.y,
        isSelected ? this.selectedStrokeStyle : this.strokeStyle);
    }
}
