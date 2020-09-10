import { CommandsData } from '../statemachine/commands/command-data';
import { AppBaseInstruction } from './app-base-instruction';
import { TransitionModel } from '../datamodel/transition';

export class DeleteTransitionInstruction extends AppBaseInstruction {
  constructor(public transition: TransitionModel) {
    super('DeleteTransition', 'data: string', 'description: string', 'timestamp: string');
  }

  public execute(commandsData: CommandsData): void {
    const index = commandsData.activeRoot.transitions.indexOf(this.transition, 0);
    if (index > -1) {
      commandsData.activeRoot.transitions.splice(index, 1);
    }
  }

  public undo(commandsData: CommandsData): void {

  }

  public preRedo(commandsData: CommandsData): void {

  }
}
