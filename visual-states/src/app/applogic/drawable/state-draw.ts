import { IDrawable, ISurfaceDraw } from 'my-libs/base-draw';
import { StateModel } from '../datamodel/state';
import { CommandsData } from '../statemachine/commands/command-data';
import { IPoint, Point } from 'my-libs/base-geometry';
import { ThemeService } from 'src/app/theme.service';

export class StateDraw implements IDrawable {
    constructor(private commandsData: CommandsData,
                private state: StateModel,
                public themeService: ThemeService) {
    }

    getLayer(): number {
      return 0;
    }

    draw(surface: ISurfaceDraw): void {
      const isSelected = this.commandsData.selectedItems.states.indexOf(this.state) >= 0;
      const shape = this.getDrawPolygon();
      surface.polygon(shape, isSelected ? this.themeService.getElementSelectedStroke() :
       this.themeService.getElementStroke(), this.themeService.getElementFill());

      const font = Math.round(surface.toDeviceScale(14)) + 'px Arial';
      surface.text(this.state.name, this.state.position.x, this.state.position.y, font, this.themeService.getElementStroke());
    }

    private getDrawPolygon(): IPoint[]{
      const res: IPoint[] = [];
      res.push(new Point(this.state.position.x - 75, this.state.position.y - 50));
      res.push(new Point(this.state.position.x + 75, this.state.position.y - 50));
      res.push(new Point(this.state.position.x + 75, this.state.position.y + 50));
      res.push(new Point(this.state.position.x - 75, this.state.position.y + 50));
      res.push(new Point(this.state.position.x - 75, this.state.position.y - 50));
      return res;
    }
}
