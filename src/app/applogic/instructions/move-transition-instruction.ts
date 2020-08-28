import { CommandsData } from '../statemachine/commands/command-data';
import { AppBaseInstruction } from './app-base-instruction';
import { TransitionModel } from '../datamodel/transition';
import { Point } from 'my-libs/base-geometry';

export class MoveTransitionInstruction extends AppBaseInstruction {
  constructor(public transition: TransitionModel, public x: number, public y: number) {
    super('MoveTransition', 'data: string', 'description: string', 'timestamp: string');
  }

  public execute(commandsData: CommandsData): void {
    if (this.transition.editState === 0){
      this.transition.positionSource = new Point(this.x, this.y);
    } else if (this.transition.editState === 1){
      this.transition.positionTarget = new Point(this.x, this.y);
    } else {
      // TODO: Offset both
    }
  }

  public undo(commandsData: CommandsData): void {

  }

  public preRedo(commandsData: CommandsData): void {

  }
}
