import { CommandsData } from '../statemachine/commands/command-data';
import { AppBaseInstruction } from './app-base-instruction';
import { StateModel } from '../datamodel/state';

export class DeleteStateInstruction extends AppBaseInstruction {
  constructor(public state: StateModel) {
    super('DeleteState', 'data: string', 'description: string', 'timestamp: string');
  }

  public execute(commandsData: CommandsData): void {

  }

  public undo(commandsData: CommandsData): void {

  }

  public preRedo(commandsData: CommandsData): void {

  }
}
