import { CommandsData } from './command-data';
import { IBaseCommand } from 'my-libs/state-machine';
import { SurfaceData } from 'my-libs/surface-draw';
import { StateModel } from '../../datamodel/state';
import { TransitionModel } from '../../datamodel/transition';
import { PointExtensions, LineExtensions, Line } from 'my-libs/base-geometry';

export class UpdateFocusCommand implements IBaseCommand {
  constructor(private commandsData: CommandsData) {

  }

  public execute(data: SurfaceData): boolean {
    const viewStep = 5 / this.commandsData.viewControl.scale;
    let minDist = viewStep;
    let nearestState: StateModel = null;
    let nearestTransition: TransitionModel = null;

    for (const t of this.commandsData.activeRoot.transitions){
      const posSource = (t.sourceStateId && t.sourceStateId.length > 0) ?
        this.commandsData.activeRoot.findStateById(t.sourceStateId).position : t.positionSource;
      const distStart = PointExtensions.distance(posSource, data.modelPoint);
      if (distStart < viewStep && distStart < minDist){
        minDist = distStart;
        nearestTransition = t;
        nearestTransition.editState = 0;
      } else {
        const posTarget = (t.targetStateId && t.targetStateId.length > 0) ?
          this.commandsData.activeRoot.findStateById(t.targetStateId).position : t.positionTarget;
        const distEnd = PointExtensions.distance(posTarget, data.modelPoint);
        if (distEnd < viewStep && distEnd < minDist){
          minDist = distEnd;
          nearestTransition = t;
          nearestTransition.editState = 1;
        } else {
          const line = new Line(posSource, posTarget);
          const distLine = LineExtensions.distance(line, data.modelPoint);

          if (distLine < viewStep && distLine < minDist){
            minDist = distLine;
            nearestTransition = t;
            nearestTransition.editState = 2;
          }
        }
      }
    }

    for (const s of this.commandsData.activeRoot.states){
      const dist = PointExtensions.distance(s.position, data.modelPoint);
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
}
