import { CommandsData } from './command-data';
import { IBaseCommand } from 'my-libs/state-machine';

export class MoveAreaCommand implements IBaseCommand {
  constructor(private commandsData: CommandsData) {

  }

  public execute(data: any): boolean {
    const last = this.commandsData.activeOffset;
    data.surface.offsetX += data.surface.fromDeviceScale(data.screenPoint.x - last.x);
    data.surface.offsetY -= data.surface.fromDeviceScale(data.screenPoint.y - last.y);
    this.commandsData.activeOffset.x = data.screenPoint.x;
    this.commandsData.activeOffset.y = data.screenPoint.y;

    return true;
  }
}
