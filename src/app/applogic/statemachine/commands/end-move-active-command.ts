import { CommandsData } from './command-data';
import { IBaseCommand } from 'my-libs/state-machine';
import { ModelInstructionProcessor } from '../../instructions/state-instruction-processor';
import { SurfaceData } from 'my-libs/surface-draw';

export class EndMoveActiveCommand implements IBaseCommand {
  constructor(private commandsData: CommandsData) {

  }

  public execute(data: SurfaceData): boolean {
    for (const s of this.commandsData.selectedItems.states){
      const moveStateInstruction = ModelInstructionProcessor.createMoveStateInstruction(s, data.modelPoint.x, data.modelPoint.y);
      this.commandsData.instructionSet.execute(moveStateInstruction);
    }

    let focusStateId = -1;
    if (this.commandsData.focusItems.states.length > 0){
      focusStateId = this.commandsData.activeRoot.states.indexOf(this.commandsData.focusItems.states[0]);
    }

    for (const t of this.commandsData.selectedItems.transitions){
      const moveTransitionInstruction = ModelInstructionProcessor.createMoveTransitionInstruction(t, focusStateId,
        data.modelPoint.x, data.modelPoint.y);
      this.commandsData.instructionSet.execute(moveTransitionInstruction);
    }

    this.commandsData.invalidateModelDrawing();

    return true;
  }
}
