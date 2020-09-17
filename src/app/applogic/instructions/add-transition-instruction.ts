import { CommandsData } from '../statemachine/commands/command-data';
import { AppBaseInstruction } from './app-base-instruction';
import { TransitionModel } from '../datamodel/transition';
import { Point } from 'my-libs/base-geometry';
import { Guid } from '../common/guid';

export class AddTransitionInstruction extends AppBaseInstruction {
  private transition: TransitionModel;

  constructor(public x: number, public y: number) {
    super('AddTransition', 'data: string', 'description: string', 'timestamp: string');
    this.transition = new TransitionModel();
    this.transition.id = Guid.newGuid();
  }

  public execute(commandsData: CommandsData): void {
    this.transition.positionSource = new Point(this.x, this.y);
    this.transition.positionTarget = new Point(this.x + 10, this.y);
    this.transition.editState = 1;
    commandsData.activeRoot.transitions.push(this.transition);
  }

  public undo(commandsData: CommandsData): void {
    const idx = commandsData.activeRoot.transitions.indexOf(this.transition);
    commandsData.activeRoot.transitions.splice(idx, 1);
  }

  public preRedo(commandsData: CommandsData): void {

  }
}
