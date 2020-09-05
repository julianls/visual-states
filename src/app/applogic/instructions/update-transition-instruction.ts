import { CommandsData } from '../statemachine/commands/command-data';
import { AppBaseInstruction } from './app-base-instruction';
import { TransitionModel } from '../datamodel/transition';

export class UpdateTransitionInstruction extends AppBaseInstruction {
  constructor(private target: TransitionModel, private source: TransitionModel) {
    super('UpdateTransition', 'data: string', 'description: string', 'timestamp: string');
  }

  public execute(commandsData: CommandsData): void {
    this.target.copyProperties(this.source);
  }

  public undo(commandsData: CommandsData): void {

  }

  public preRedo(commandsData: CommandsData): void {

  }
}
