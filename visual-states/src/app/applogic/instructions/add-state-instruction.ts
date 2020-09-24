import { CommandsData } from '../statemachine/commands/command-data';
import { AppBaseInstruction } from './app-base-instruction';
import { StateModel } from '../datamodel/state';
import { Point } from 'my-libs/base-geometry';
import { Guid } from '../common/guid';

export class AddStateInstruction extends AppBaseInstruction {
  private state: StateModel;

  constructor(public x: number, public y: number) {
    super('AddState', 'data: string', 'description: string', 'timestamp: string');
    this.state = new StateModel();
    this.state.id = Guid.newGuid();
  }

  public execute(commandsData: CommandsData): void {
    this.state.name = 'New State';
    this.state.position = new Point(this.x, this.y);
    commandsData.activeRoot.states.push(this.state);
  }

  public undo(commandsData: CommandsData): void {
    const idx = commandsData.activeRoot.states.indexOf(this.state);
    commandsData.activeRoot.states.splice(idx, 1);
  }

  public preRedo(commandsData: CommandsData): void {

  }
}
