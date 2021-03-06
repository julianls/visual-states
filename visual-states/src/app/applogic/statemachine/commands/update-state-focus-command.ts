import { CommandsData } from './command-data';
import { IBaseCommand } from 'my-libs/state-machine';
import { SurfaceData } from 'my-libs/surface-draw';
import { StateModel } from '../../datamodel/state';
import { PointExtensions } from 'my-libs/base-geometry';

export class UpdateStateFocusCommand implements IBaseCommand {
  constructor(private commandsData: CommandsData) {

  }

  public execute(data: SurfaceData): boolean {
    const viewStep = 5 / this.commandsData.viewControl.scale;
    let minDist = viewStep;
    let nearestState: StateModel = null;

    for (const s of this.commandsData.activeRoot.states){
      const dist = PointExtensions.distance(s.position, data.modelPoint);
      if (dist < 100){
        minDist = dist;
        nearestState = s;
      }
    }


    this.commandsData.focusItems.clear();

    if (nearestState !== null) {
      this.commandsData.focusItems.states.push(nearestState);
    }

    this.commandsData.invalidateModelDrawing();

    return true;
  }
}
