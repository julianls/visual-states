import { CommandsData } from '../statemachine/commands/command-data';
import { AppBaseInstruction } from './app-base-instruction';
import { StateModel } from '../datamodel/state';
import { Point } from 'my-libs/base-geometry';
import { Instruction } from 'my-libs/base-instruction';

export class MoveStateInstruction extends AppBaseInstruction {
  private oldX = 0;
  private oldY = 0;

  constructor(public state: StateModel, public x: number, public y: number) {
    super('MoveState', 'data: string', 'description: string', 'timestamp: string');
    this.oldX = state.position.x;
    this.oldY = state.position.y;
  }

  public execute(commandsData: CommandsData): void {
    this.state.position = new Point(this.x, this.y);
  }

  public undo(commandsData: CommandsData): void {
    this.state.position = new Point(this.oldX, this.oldY);
  }

  public preRedo(commandsData: CommandsData): void {

  }

  public agregate(instruction: Instruction): boolean {
    const cmd = instruction as MoveStateInstruction;
    if (cmd.state !== undefined && cmd.state === this.state){
      cmd.x = this.x;
      cmd.y = this.y;
      return true;
    }
    return false;
  }
}
