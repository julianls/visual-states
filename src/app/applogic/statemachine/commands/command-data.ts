import { InstructionSet, InstructionProcessor } from 'my-libs/base-instruction';
import { Point } from 'my-libs/base-geometry';
import { ViewControl } from 'my-libs/surface-draw';
import { IDrawable } from 'my-libs/base-draw';
import { StateMachineModel } from '../../datamodel/state-machine';
import { AppDataService } from '../../../app-data.service';

export class CommandsData {
    public instructionSet: InstructionSet = new InstructionSet();

    public isRequesting = false;
    public activeOffset: Point = new Point(0, 0);

    constructor(public dataService: AppDataService, public viewControl: ViewControl,
                public model: StateMachineModel, public drawItems: IDrawable[]) {
    }

    public setInstructionProcessor(processor: InstructionProcessor): void {
        this.instructionSet.instructionProcessor = processor;
    }
}
