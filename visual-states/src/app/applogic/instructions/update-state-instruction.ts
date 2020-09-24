import { CommandsData } from '../statemachine/commands/command-data';
import { AppBaseInstruction } from './app-base-instruction';
import { StateModel } from '../datamodel/state';

export class UpdateStateInstruction extends AppBaseInstruction {
  private backup: StateModel;

  constructor(private target: StateModel, private source: StateModel) {
    super('UpdateState', 'data: string', 'description: string', 'timestamp: string');
    this.backup = new StateModel();
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
