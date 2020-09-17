import { CommandsData } from '../statemachine/commands/command-data';
import { AppBaseInstruction } from './app-base-instruction';
import { TransitionModel } from '../datamodel/transition';

export class UpdateTransitionInstruction extends AppBaseInstruction {
  private backup: TransitionModel;

  constructor(private target: TransitionModel, private source: TransitionModel) {
    super('UpdateTransition', 'data: string', 'description: string', 'timestamp: string');
    this.backup = new TransitionModel();
    this.backup.copyProperties(this.target);
  }

  public execute(commandsData: CommandsData): void {
    this.target.copyProperties(this.source);
  }

  public undo(commandsData: CommandsData): void {
    this.target.copyProperties(this.backup);
  }

  public preRedo(commandsData: CommandsData): void {

  }
}
