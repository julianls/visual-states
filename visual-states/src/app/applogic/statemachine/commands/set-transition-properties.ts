import { CommandsData } from './command-data';
import { IBaseCommand } from 'my-libs/state-machine';
import { ModelInstructionProcessor } from '../../instructions/state-instruction-processor';
import { TransitionModel } from '../../datamodel/transition';


export class SetTransitionPropertiesCommand implements IBaseCommand {
  constructor(private commandsData: CommandsData) {

  }

  public execute(data: TransitionModel): boolean {
    const target: TransitionModel = this.commandsData.selectedItems.transitions[0];
    const instruction = ModelInstructionProcessor.createUpdateTransitionInstruction(target, data);
    this.commandsData.instructionSet.execute(instruction);

    this.commandsData.instructionSet.setBreak();

    return true;
  }
}
