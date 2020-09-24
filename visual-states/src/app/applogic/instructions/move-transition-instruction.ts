import { CommandsData } from '../statemachine/commands/command-data';
import { AppBaseInstruction } from './app-base-instruction';
import { TransitionModel } from '../datamodel/transition';
import { Point } from 'my-libs/base-geometry';
import { Instruction } from 'my-libs/base-instruction';

export class MoveTransitionInstruction extends AppBaseInstruction {
  private oldX = 0;
  private oldY = 0;
  private oldSid = -1;
  private oldEdit = 0;

  constructor(public transition: TransitionModel, public focusStateId: number, public x: number, public y: number) {
    super('MoveTransition', 'data: string', 'description: string', 'timestamp: string');
    this.oldEdit = this.transition.editState;
    if (this.transition.editState === 0){
      this.oldX = transition.positionSource.x;
      this.oldY = transition.positionSource.y;
      this.oldSid = this.transition.sourceStateId;
    } else if (this.transition.editState === 1){
      this.oldX = transition.positionTarget.x;
      this.oldY = transition.positionTarget.y;
      this.oldSid = this.transition.targetStateId;
    }
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
    this.transition.editState = this.oldEdit;
    if (this.transition.editState === 0){
      this.transition.positionSource = new Point(this.oldX, this.oldY);
      this.transition.sourceStateId = this.oldSid;
    } else if (this.transition.editState === 1){
      this.transition.positionTarget = new Point(this.oldX, this.oldY);
      this.transition.targetStateId = this.oldSid;
    } else {
      // TODO: Offset both
    }
  }

  public preRedo(commandsData: CommandsData): void {

  }

  public agregate(instruction: Instruction): boolean {
    const cmd = instruction as MoveTransitionInstruction;
    if (cmd.transition !== undefined && cmd.transition === this.transition){
      cmd.x = this.x;
      cmd.y = this.y;
      return true;
    }
    return false;
  }
}
