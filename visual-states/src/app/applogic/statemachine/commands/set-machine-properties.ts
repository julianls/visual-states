import { CommandsData } from './command-data';
import { IBaseCommand } from 'my-libs/state-machine';
import { ModelInstructionProcessor } from '../../instructions/state-instruction-processor';
import { StateMachineModel } from '../../datamodel/state-machine';


export class SetMachinePropertiesCommand implements IBaseCommand {
  constructor(private commandsData: CommandsData) {

  }

  public execute(data: StateMachineModel): boolean {
    const target: StateMachineModel = this.commandsData.model;
    const instruction = ModelInstructionProcessor.createUpdateMachineInstruction(target, data);
    this.commandsData.instructionSet.execute(instruction);

    this.commandsData.instructionSet.setBreak();

    return true;
  }
}
