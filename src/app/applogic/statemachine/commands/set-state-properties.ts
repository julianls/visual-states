import { CommandsData } from './command-data';
import { IBaseCommand } from 'my-libs/state-machine';
import { ModelInstructionProcessor } from '../../instructions/state-instruction-processor';
import { StateModel } from '../../datamodel/state';


export class SetStatePropertiesCommand implements IBaseCommand {
  constructor(private commandsData: CommandsData) {

  }

  public execute(data: StateModel): boolean {
    const target: StateModel = this.commandsData.selectedItems.states[0];
    const instruction = ModelInstructionProcessor.createUpdateStateInstruction(target, data);
    this.commandsData.instructionSet.execute(instruction);

    this.commandsData.instructionSet.setBreak();

    return true;
  }
}
