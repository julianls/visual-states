import { CommandsData } from './command-data';
import { IBaseCommand } from 'my-libs/state-machine';
import { SurfaceData } from 'my-libs/surface-draw';
import { StateModel } from '../../datamodel/state';
import { TransitionModel } from '../../datamodel/transition';

export class UpdateFocusCommand implements IBaseCommand {
  constructor(private commandsData: CommandsData) {

  }

  public execute(data: SurfaceData): boolean {
    const viewStep = 5 / this.commandsData.viewControl.scale;
    let minDist = viewStep;
    let nearestState: StateModel = null;
    let nearestTransition: TransitionModel = null;

    for (const t of this.commandsData.model.transitions){
      const distStart = this.distance(t.positionSource.x, t.positionSource.y, data.modelPoint.x, data.modelPoint.y);
      if (distStart < viewStep && distStart < minDist){
        minDist = distStart;
        nearestTransition = t;
        nearestTransition.editState = 0;
      }

      const distEnd = this.distance(t.positionTarget.x, t.positionTarget.y, data.modelPoint.x, data.modelPoint.y);
      if (distEnd < viewStep && distEnd < minDist){
        minDist = distEnd;
        nearestTransition = t;
        nearestTransition.editState = 1;
      }
    }

    for (const s of this.commandsData.model.states){
      const dist = this.distance(s.position.x, s.position.y, data.modelPoint.x, data.modelPoint.y);
      if (dist < 100 && nearestTransition === null){
        minDist = dist;
        nearestState = s;
      }
    }


    this.commandsData.focusItems.clear();

    if (nearestState !== null) {
      this.commandsData.focusItems.states.push(nearestState);
    }
    if (nearestTransition !== null) {
      this.commandsData.focusItems.transitions.push(nearestTransition);
    }

    this.commandsData.invalidateModelDrawing();

    return true;
  }

  private distance(x: number, y: number, x1: number, y1: number): number {
    const v1 = x - x1;
    const v2 = y - y1;
    return Math.sqrt((v1 * v1) + (v2 * v2));
  }
}
