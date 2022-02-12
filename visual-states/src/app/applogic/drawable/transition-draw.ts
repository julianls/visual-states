import { IDrawable, IPoint, ISurfaceDraw } from 'my-libs/base-draw';
import { Matrix, Point, PointExtensions } from 'my-libs/base-geometry';
import { ThemeService } from 'src/app/theme.service';
import { TransitionModel } from '../datamodel/transition';
import { CommandsData } from '../statemachine/commands/command-data';

export class TransitionDraw implements IDrawable {
    constructor(private commandsData: CommandsData,
                private transition: TransitionModel,
                public themeService: ThemeService) {
    }

    getLayer(): number {
      return 0;
    }

    draw(surface: ISurfaceDraw): void {
      const isSelected = this.commandsData.selectedItems.transitions.indexOf(this.transition) >= 0;

      let sourcePos = this.transition.positionSource;
      if (this.transition.sourceStateId && this.transition.sourceStateId.length > 0){
        sourcePos = this.commandsData.activeRoot.findStateById(this.transition.sourceStateId).position;
      }

      let targetPos = this.transition.positionTarget;
      if (this.transition.targetStateId && this.transition.targetStateId.length > 0){
        targetPos = this.commandsData.activeRoot.findStateById(this.transition.targetStateId).position;
      }

      const stroke = isSelected ? this.themeService.getElementSelectedStroke() : this.themeService.getElementStroke();

      surface.line(sourcePos.x, sourcePos.y, targetPos.x, targetPos.y, stroke);

      // Draw direction arrow
      let ptEdge: IPoint = new Point(0, 0);
      let ptEdge1: IPoint = new Point(-10, -7);
      let ptEdge2: IPoint = new Point(-10, 7);

      const arrowX = (sourcePos.x + targetPos.x) / 2;
      const arrowY = (sourcePos.y + targetPos.y) / 2;

      const angleRad = Math.atan2(targetPos.y - sourcePos.y, targetPos.x - sourcePos.x);

      const mt: Matrix = Matrix.createTranslation(arrowX, arrowY, 0);
      const mr: Matrix = Matrix.createRotationZ(angleRad);

      const m: Matrix = Matrix.multiply(mr, mt);

      ptEdge = PointExtensions.transform(ptEdge, m);
      ptEdge1 = PointExtensions.transform(ptEdge1, m);
      ptEdge2 = PointExtensions.transform(ptEdge2, m);

      const arrow: IPoint[] = [];
      arrow.push(ptEdge);
      arrow.push(ptEdge1);
      arrow.push(ptEdge2);

      surface.polygon(arrow, stroke, stroke);
  }
}
