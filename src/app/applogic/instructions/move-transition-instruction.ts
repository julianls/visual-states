import { CommandsData } from '../statemachine/commands/command-data';
import { AppBaseInstruction } from './app-base-instruction';
import { TransitionModel } from '../datamodel/transition';
import { Point } from 'my-libs/base-geometry';
import { StateModel } from '../datamodel/state';

export class MoveTransitionInstruction extends AppBaseInstruction {
  constructor(public transition: TransitionModel, public focusStateId: number, public x: number, public y: number) {
    super('MoveTransition', 'data: string', 'description: string', 'timestamp: string');
  }

  public execute(commandsData: CommandsData): void {
    if (this.transition.editState === 0){
      this.transition.positionSource = new Point(this.x, this.y);
      this.transition.sourceStateId = this.focusStateId;
    } else if (this.transition.editState === 1){
      this.transition.positionTarget = new Point(this.x, this.y);
      this.transition.targetStateId = this.focusStateId;
    } else {
      // TODO: Offset both
    }
  }

  public undo(commandsData: CommandsData): void {

  }

  public preRedo(commandsData: CommandsData): void {

  }
}
