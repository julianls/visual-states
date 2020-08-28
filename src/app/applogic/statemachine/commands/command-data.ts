import { InstructionSet, InstructionProcessor } from 'my-libs/base-instruction';
import { Point } from 'my-libs/base-geometry';
import { ViewControl } from 'my-libs/surface-draw';
import { IDrawable } from 'my-libs/base-draw';
import { StateMachineModel } from '../../datamodel/state-machine';
import { AppDataService } from '../../../app-data.service';
import { ItemsContainer } from '../../datamodel/items-container';
import { StateDraw } from '../../drawable/state-draw';
import { TransitionDraw } from '../../drawable/transition-draw';

export class CommandsData {
    public instructionSet: InstructionSet = new InstructionSet();
    public focusItems: ItemsContainer = new ItemsContainer();
    public selectedItems: ItemsContainer = new ItemsContainer();

    public isRequesting = false;
    public activeOffset: Point = new Point(0, 0);

    constructor(public dataService: AppDataService, public viewControl: ViewControl,
                public model: StateMachineModel, public drawItems: IDrawable[]) {
    }

    public setInstructionProcessor(processor: InstructionProcessor): void {
        this.instructionSet.instructionProcessor = processor;
    }

    public invalidateModelDrawing(): void {
        this.viewControl.invalidate();
    }

    public reloadDrawItems(): void {
        this.drawItems.splice(0);
        for (const s of this.model.states){
            this.drawItems.push(new StateDraw(this.model, s));
        }

        for (const t of this.model.transitions){
            this.drawItems.push(new TransitionDraw(this.model, t));
        }
        this.invalidateModelDrawing();
    }
}
