import { CommandsData } from './command-data';
import { IBaseCommand } from 'my-libs/state-machine';

export class ZoomAllCommand implements IBaseCommand {
  constructor(private commandsData: CommandsData) {

  }

  public execute(data: any): boolean {
    // let toDrawTool = new ModelToDrawingTool(this.commandsData);
    // toDrawTool.generate();

    // if (!(toDrawTool.ptEnd === null || toDrawTool.ptStart === null)) {
    //   let dataWidth = toDrawTool.ptEnd.x - toDrawTool.ptStart.x;
    //   let dataHeight = toDrawTool.ptEnd.y - toDrawTool.ptStart.y;
    //   let center = new Position((toDrawTool.ptEnd.x + toDrawTool.ptStart.x) / 2.0, (toDrawTool.ptEnd.y + toDrawTool.ptStart.y) / 2.0);
    //   let margin = 20;

    //   this.commandsData.viewControl.offsetX = -center.X;
    //   this.commandsData.viewControl.offsetY = -center.Y;
    //   this.commandsData.viewControl.scale = Math.min((this.commandsData.viewControl.height - margin) / dataHeight,
    //     (this.commandsData.viewControl.width - margin) / dataWidth);
    //   this.commandsData.viewControl.zoomOut();
    // }
    return true;
  }
}
