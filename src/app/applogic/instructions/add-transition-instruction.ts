import { CommandsData } from '../statemachine/commands/command-data';
import { AppBaseInstruction } from './app-base-instruction';
import { TransitionModel } from '../datamodel/transition';
import { Point } from 'my-libs/base-geometry';
import { Guid } from '../common/guid';

export class AddTransitionInstruction extends AppBaseInstruction {
  constructor(public x: number, public y: number) {
    super('AddTransition', 'data: string', 'description: string', 'timestamp: string');
  }

  public execute(commandsData: CommandsData): void {
    const transition: TransitionModel = new TransitionModel();
    transition.id = Guid.newGuid();
    transition.positionSource = new Point(this.x, this.y);
    transition.positionTarget = new Point(this.x + 10, this.y);
    transition.editState = 1;
    commandsData.model.transitions.push(transition);
  }

  public undo(commandsData: CommandsData): void {

  }

  public preRedo(commandsData: CommandsData): void {

  }
}
