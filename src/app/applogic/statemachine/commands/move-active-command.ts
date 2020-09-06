import { CommandsData } from './command-data';
import { IBaseCommand } from 'my-libs/state-machine';
import { ModelInstructionProcessor } from '../../instructions/state-instruction-processor';
import { SurfaceData } from 'my-libs/surface-draw';

export class MoveActiveCommand implements IBaseCommand {
  constructor(private commandsData: CommandsData) {

  }

  public execute(data: SurfaceData): boolean {
    for (const s of this.commandsData.selectedItems.states){
      const moveStateInstruction = ModelInstructionProcessor.createMoveStateInstruction(s, data.modelPoint.x, data.modelPoint.y);
      this.commandsData.instructionSet.execute(moveStateInstruction);
    }

    for (const t of this.commandsData.selectedItems.transitions){
      const moveTransitionInstruction = ModelInstructionProcessor.createMoveTransitionInstruction(t, -1,
        data.modelPoint.x, data.modelPoint.y);
      this.commandsData.instructionSet.execute(moveTransitionInstruction);
    }

    this.commandsData.invalidateModelDrawing();
    return true;
  }
}
