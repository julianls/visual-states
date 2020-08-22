import { CommandsData } from './command-data';
import { IBaseCommand } from 'my-libs/state-machine';
import { SurfaceData } from 'my-libs/surface-draw';

export class ZoomAreaCommand implements IBaseCommand {
  constructor(private commandsData: CommandsData) {

  }

  public execute(data: SurfaceData): boolean {
    const wheelDelta = Math.max(-1, Math.min(1, (data.event.wheelDelta || -data.event.detail)));
    if (data.event.altKey) {
      data.surface.offsetX += wheelDelta * 100;
    } else if (data.event.shiftKey) {
      data.surface.offsetY += wheelDelta * 100;
    } else if (wheelDelta > 0) {
      data.surface.scale /= 0.80;
    } else {
      data.surface.scale *= 0.80;
    }

    return true;
  }
}
