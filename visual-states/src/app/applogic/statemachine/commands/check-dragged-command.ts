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
      const touch = data.event.touches[0];
      const initialTouch = data.stateEvent.touches[0];
      const isDragged = Math.abs(touch.clientX - initialTouch.clientX) > 10 ||
        Math.abs(touch.clientY - initialTouch.clientY) > 10;
      return isDragged;
    }
  }
}
