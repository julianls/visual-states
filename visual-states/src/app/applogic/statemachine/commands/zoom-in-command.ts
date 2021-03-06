import { CommandsData } from './command-data';
import { IBaseCommand } from 'my-libs/state-machine';

export class ZoomInCommand implements IBaseCommand {
  constructor(private commandsData: CommandsData) {

  }

  public execute(data: any): boolean {
    this.commandsData.viewControl.zoomIn();
    return true;
  }
}
