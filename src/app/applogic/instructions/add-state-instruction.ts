import { CommandsData } from '../statemachine/commands/command-data';
import { AppBaseInstruction } from './app-base-instruction';
import { StateModel } from '../datamodel/state';
import { Point } from 'my-libs/base-geometry';

export class AddStateInstruction extends AppBaseInstruction {
  constructor(public x: number, public y: number) {
    super('AddState', 'data: string', 'description: string', 'timestamp: string');
  }

  public execute(commandsData: CommandsData): void {
    const state: StateModel = new StateModel();
    state.position = new Point(this.x, this.y);
    commandsData.model.states.push(state);
  }

  public undo(commandsData: CommandsData): void {

  }

  public preRedo(commandsData: CommandsData): void {

  }
}
