import { CommandsData } from '../statemachine/commands/command-data';
import { AppBaseInstruction } from './app-base-instruction';
import { StateMachineModel } from '../datamodel/state-machine';

export class UpdateMachineInstruction extends AppBaseInstruction {
  constructor(private target: StateMachineModel, private source: StateMachineModel) {
    super('UpdateStateMachine', 'data: string', 'description: string', 'timestamp: string');
  }

  public execute(commandsData: CommandsData): void {
    this.target.copyProperties(this.source);
  }

  public undo(commandsData: CommandsData): void {

  }

  public preRedo(commandsData: CommandsData): void {

  }
}
