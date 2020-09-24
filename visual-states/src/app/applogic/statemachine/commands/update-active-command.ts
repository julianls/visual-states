import { CommandsData } from './command-data';
import { IBaseCommand } from 'my-libs/state-machine';
import { SurfaceData } from 'my-libs/surface-draw';

export class UpdateActiveCommand implements IBaseCommand {
  constructor(private commandsData: CommandsData) {

  }

  public execute(data: SurfaceData): boolean {
    this.commandsData.selectedItems.clear();
    if (!data.event.altKey) {
      this.commandsData.selectedItems.append(this.commandsData.focusItems);
    }
    if (this.commandsData.selectedItems.states.length === 0 &&
      this.commandsData.selectedItems.transitions.length === 0) {
      this.commandsData.activeOffset.x = data.screenPoint.x;
      this.commandsData.activeOffset.y = data.screenPoint.y;
    }
    this.commandsData.invalidateModelDrawing();

    return true;
  }
}
