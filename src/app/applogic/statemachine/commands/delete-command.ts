import { CommandsData } from './command-data';
import { IBaseCommand } from 'my-libs/state-machine';
import { ModelInstructionProcessor } from '../../instructions/state-instruction-processor';

export class DeleteCommand implements IBaseCommand {
  constructor(private commandsData: CommandsData) {

  }

  public execute(data: any): boolean {

    for (const s of this.commandsData.selectedItems.states){
      const deleteStateInstruction = ModelInstructionProcessor.createDeleteStateInstruction(s);
      this.commandsData.instructionSet.execute(deleteStateInstruction);
    }

    for (const t of this.commandsData.selectedItems.transitions){
      const deleteTransitionInstruction = ModelInstructionProcessor.
        createDeleteTransitionInstruction(t);
      this.commandsData.instructionSet.execute(deleteTransitionInstruction);
    }

    this.commandsData.instructionSet.setBreak();
    this.commandsData.selectedItems.clear();
    this.commandsData.reloadDrawItems();

    return true;
  }
}
