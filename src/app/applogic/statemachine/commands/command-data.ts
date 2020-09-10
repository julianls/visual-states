import { InstructionSet, InstructionProcessor } from 'my-libs/base-instruction';
import { Point } from 'my-libs/base-geometry';
import { ViewControl } from 'my-libs/surface-draw';
import { IDrawable } from 'my-libs/base-draw';
import { StateMachineModel } from '../../datamodel/state-machine';
import { AppDataService } from '../../../app-data.service';
import { ItemsContainer } from '../../datamodel/items-container';
import { StateDraw } from '../../drawable/state-draw';
import { TransitionDraw } from '../../drawable/transition-draw';
import { StateModel } from '../../datamodel/state';

export class CommandsData {
    public instructionSet: InstructionSet = new InstructionSet();
    public focusItems: ItemsContainer = new ItemsContainer();
    public selectedItems: ItemsContainer = new ItemsContainer();
    public activeRoot: StateModel = null;

    public isRequesting = false;
    public activeOffset: Point = new Point(0, 0);

    constructor(public dataService: AppDataService, public viewControl: ViewControl,
                public model: StateMachineModel, public drawItems: IDrawable[]) {
        this.activeRoot = model;
    }

    public setInstructionProcessor(processor: InstructionProcessor): void {
        this.instructionSet.instructionProcessor = processor;
    }

    public invalidateModelDrawing(): void {
        this.viewControl.invalidate();
    }

    public reloadDrawItems(): void {
        this.drawItems.splice(0);

        for (const t of this.activeRoot.transitions){
            this.drawItems.push(new TransitionDraw(this, t));
        }

        for (const s of this.activeRoot.states){
            this.drawItems.push(new StateDraw(this, s));
        }

        this.invalidateModelDrawing();
    }

    public getActiveRootParent(): StateModel {
        const parents = this.getParents(this.activeRoot);
        return parents[0];
    }

    public getParents(item: StateModel): StateModel[] {
        const result: StateModel[] = [];
        if (this.model !== item){
            this.appendIfExists(item, this.model, result);
        }
        result.push(this.model);
        return result;
    }

    private appendIfExists(item: StateModel, state: StateModel, result: StateModel[]): boolean {
        if (item === state){
            return true;
        }

        for (const s of state.states){
            if (this.appendIfExists(item, s, result)){
                result.push(state);
                return true;
            }
        }

        return false;
    }
}
