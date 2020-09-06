import { IDrawable, ISurfaceDraw } from 'my-libs/base-draw';
import { StateModel } from '../datamodel/state';
import { CommandsData } from '../statemachine/commands/command-data';

export class StateDraw implements IDrawable {
    constructor(private commandsData: CommandsData,
                private state: StateModel,
                private strokeStyle: string = '#F3E5F5',
                private selectedStrokeStyle: string = '#23D18B') {
    }

    getLayer(): number {
      return 0;
    }

    draw(surface: ISurfaceDraw): void {
      const isSelected = this.commandsData.selectedItems.states.indexOf(this.state) >= 0;
      surface.rect(this.state.position.x - 75, this.state.position.y - 50,
                   150, 100, isSelected ? this.selectedStrokeStyle : this.strokeStyle);

      const font = Math.round(surface.toDeviceScale(14)) + 'px Arial';
      surface.text(this.state.name, this.state.position.x, this.state.position.y, font);
    }
}
