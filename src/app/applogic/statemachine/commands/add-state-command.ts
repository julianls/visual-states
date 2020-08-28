import { CommandsData } from './command-data';
import { IBaseCommand } from 'my-libs/state-machine';
import { SurfaceData } from 'my-libs/surface-draw';
import { ModelInstructionProcessor } from '../../instructions/state-instruction-processor';

export class AddStateCommand implements IBaseCommand {
  constructor(private commandsData: CommandsData) {

  }

  public execute(data: SurfaceData): boolean {
    const addStateInstruction = ModelInstructionProcessor.createAddStateInstruction(data.modelPoint.x, data.modelPoint.y);

    this.commandsData.instructionSet.execute(addStateInstruction);

    const newState = this.commandsData.model.states[this.commandsData.model.states.length - 1];

    this.commandsData.instructionSet.setBreak();
    this.commandsData.selectedItems.clear();
    this.commandsData.selectedItems.states.push(newState);
    this.commandsData.reloadDrawItems();
    return true;
  }
}
