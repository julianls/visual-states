import { Component, OnInit } from '@angular/core';
import { IDrawable } from 'my-libs/base-draw';
import { ViewControl, SurfaceData } from 'my-libs/surface-draw';
import { MainStateMachine } from '../applogic/statemachine/main-state-machine';
import { CommandsData } from '../applogic/statemachine/commands/command-data';
import { StateDraw } from '../applogic/drawable/state-draw';
import { TransitionDraw } from '../applogic/drawable/transition-draw';
import { ModelInstructionProcessor } from '../applogic/instructions/state-instruction-processor';
import { AppDataService } from '../app-data.service';
import { StateMachineModel } from '../applogic/datamodel/state-machine';

@Component({
  selector: 'app-state-machine',
  templateUrl: './state-machine.component.html',
  styleUrls: ['./state-machine.component.scss']
})
export class StateMachineComponent implements OnInit {
  public drawItems: IDrawable[] = [];
  public viewControl: ViewControl = new ViewControl();
  public commandsData: CommandsData;
  public stateMachine: MainStateMachine = new MainStateMachine();

  constructor(private dataService: AppDataService) {
    this.commandsData = new CommandsData(this.dataService, this.viewControl, null, this.drawItems);
    this.commandsData.isRequesting = true;
  }

  ngOnInit(): void {
    this.commandsData.setInstructionProcessor(new ModelInstructionProcessor(this.commandsData));
    this.initData(new StateMachineModel());
  }

  private initData(model: StateMachineModel): void {
    this.commandsData = new CommandsData(this.dataService, this.viewControl, model, this.drawItems);
    this.commandsData.setInstructionProcessor(new ModelInstructionProcessor(this.commandsData));
    // this.initCommands();
    // this.loadDrawItems();
    this.commandsData.isRequesting = false;
  }

  widthChanged(width: number): void {
    // this.viewControl.width = width;
  }

  heightChanged(height: number): void {
    // this.viewControl.height = height;
  }

  onDown(data: SurfaceData): void {
    // this.stateMachine.onevent("down", data);
  }

  onMove(data: SurfaceData): void {
    // this.stateMachine.onevent("move", data);
  }

  onUp(data: SurfaceData): void {
    // this.stateMachine.onevent("up", data);
  }

  onWheel(data: SurfaceData): void {
    // this.stateMachine.onevent("wheel", data);
  }
}
