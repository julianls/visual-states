import { CommandsData } from './command-data';
import { IBaseCommand } from 'my-libs/state-machine';
import { SurfaceData } from 'my-libs/surface-draw';

export class CheckDraggedCommand implements IBaseCommand {
  constructor(private commandsData: CommandsData) {

  }

  public execute(data: SurfaceData): boolean {
    if (data.event.x) {
      const isDragged = Math.abs(data.event.x - data.stateEvent.x) > 3 ||
        Math.abs(data.event.y - data.stateEvent.y) > 3;
      return isDragged;
    } else {
      const isDragged = Math.abs(data.event.center.x - data.stateEvent.center.x) > 3 ||
        Math.abs(data.event.center.y - data.stateEvent.center.y) > 3;
      return isDragged;
    }
  }
}
