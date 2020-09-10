import { CommandsData } from '../statemachine/commands/command-data';
import { AppBaseInstruction } from './app-base-instruction';
import { StateModel } from '../datamodel/state';

export class DeleteStateInstruction extends AppBaseInstruction {
  constructor(public state: StateModel) {
    super('DeleteState', 'data: string', 'description: string', 'timestamp: string');
  }

  public execute(commandsData: CommandsData): void {
    const index = commandsData.activeRoot.states.indexOf(this.state, 0);
    if (index > -1) {
      commandsData.activeRoot.states.splice(index, 1);
    }
  }

  public undo(commandsData: CommandsData): void {

  }

  public preRedo(commandsData: CommandsData): void {

  }
}
