import { CommandsData } from '../statemachine/commands/command-data';
import { AppBaseInstruction } from './app-base-instruction';
import { StateModel } from '../datamodel/state';

export class UpdateStateInstruction extends AppBaseInstruction {
  constructor(private target: StateModel, private source: StateModel) {
    super('UpdateState', 'data: string', 'description: string', 'timestamp: string');
  }

  public execute(commandsData: CommandsData): void {
    this.target.copyProperties(this.source);
  }

  public undo(commandsData: CommandsData): void {

  }

  public preRedo(commandsData: CommandsData): void {

  }
}
