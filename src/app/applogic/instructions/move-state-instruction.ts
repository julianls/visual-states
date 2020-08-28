import { CommandsData } from '../statemachine/commands/command-data';
import { AppBaseInstruction } from './app-base-instruction';
import { StateModel } from '../datamodel/state';
import { Point } from 'my-libs/base-geometry';

export class MoveStateInstruction extends AppBaseInstruction {
  constructor(public state: StateModel, public x: number, public y: number) {
    super('MoveState', 'data: string', 'description: string', 'timestamp: string');
  }

  public execute(commandsData: CommandsData): void {
    this.state.position = new Point(this.x, this.y);
  }

  public undo(commandsData: CommandsData): void {

  }

  public preRedo(commandsData: CommandsData): void {

  }
}
