import { CommandsData } from '../statemachine/commands/command-data';
import { AppBaseInstruction } from './app-base-instruction';
import { TransitionModel } from '../datamodel/transition';

export class DeleteTransitionInstruction extends AppBaseInstruction {
  constructor(transition: TransitionModel) {
    super('DeleteTransition', 'data: string', 'description: string', 'timestamp: string');
  }

  public execute(commandsData: CommandsData): void {

  }

  public undo(commandsData: CommandsData): void {

  }

  public preRedo(commandsData: CommandsData): void {

  }
}
