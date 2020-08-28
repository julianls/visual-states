import { CommandsData } from './command-data';
import { IBaseCommand } from 'my-libs/state-machine';
import { SurfaceData } from 'my-libs/surface-draw';
import { ModelInstructionProcessor } from '../../instructions/state-instruction-processor';

export class AddTransitionCommand implements IBaseCommand {
  constructor(private commandsData: CommandsData) {

  }

  public execute(data: SurfaceData): boolean {
    const addTransitionInstruction = ModelInstructionProcessor.createAddTransitionInstruction(data.modelPoint.x, data.modelPoint.y);

    this.commandsData.instructionSet.execute(addTransitionInstruction);

    const newTransition = this.commandsData.model.transitions[this.commandsData.model.transitions.length - 1];
    newTransition.editState = 1;

    this.commandsData.instructionSet.setBreak();
    this.commandsData.selectedItems.clear();
    this.commandsData.selectedItems.transitions.push(newTransition);
    this.commandsData.reloadDrawItems();

    return true;
  }
}
