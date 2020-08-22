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
import { StateModel } from '../applogic/datamodel/state';
import { Point } from 'my-libs/base-geometry';
import { TransitionModel } from '../applogic/datamodel/transition';
import { UpdateFocusCommand } from '../applogic/statemachine/commands/update-focus-command';
import { UpdateActiveCommand } from '../applogic/statemachine/commands/update-active-command';
import { MoveActiveCommand } from '../applogic/statemachine/commands/move-active-command';
import { EndMoveActiveCommand } from '../applogic/statemachine/commands/end-move-active-command';
import { MoveAreaCommand } from '../applogic/statemachine/commands/move-area-command';
import { ZoomAreaCommand } from '../applogic/statemachine/commands/zoom-area-command';
import { HasFocusCommand } from '../applogic/statemachine/commands/has-focus-command';
import { NoFocusCommand } from '../applogic/statemachine/commands/no-focus-command';
import { DeleteCommand } from '../applogic/statemachine/commands/delete-command';
import { ZoomAllCommand } from '../applogic/statemachine/commands/zoom-all-command';
import { ZoomInCommand } from '../applogic/statemachine/commands/zoom-in-command';
import { ZoomOutCommand } from '../applogic/statemachine/commands/zoom-out-command';
import { CleanupUncompletedCommand } from '../applogic/statemachine/commands/cleanup-uncompleted-command';
import { CheckDraggedCommand } from '../applogic/statemachine/commands/check-dragged-command';
import { SaveCommand } from '../applogic/statemachine/commands/save-command';

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
    model.states.push(new StateModel());
    model.states.push(new StateModel());
    model.states[1].position = new Point(200, 0);
    model.transitions.push(new TransitionModel());
    model.transitions[0].sourceStateId = 0;
    model.transitions[0].targetStateId = 1;

    this.commandsData = new CommandsData(this.dataService, this.viewControl, model, this.drawItems);
    this.commandsData.setInstructionProcessor(new ModelInstructionProcessor(this.commandsData));
    this.initCommands();
    this.loadDrawItems();
    this.commandsData.isRequesting = false;
  }

  private initCommands(): void {
    this.stateMachine.registerCommand('update-focus', new UpdateFocusCommand(this.commandsData));
    this.stateMachine.registerCommand('update-active', new UpdateActiveCommand(this.commandsData));
    this.stateMachine.registerCommand('move-active', new MoveActiveCommand(this.commandsData));
    this.stateMachine.registerCommand('end-move-active', new EndMoveActiveCommand(this.commandsData));
    this.stateMachine.registerCommand('move-area', new MoveAreaCommand(this.commandsData));
    this.stateMachine.registerCommand('zoom-area', new ZoomAreaCommand(this.commandsData));
    this.stateMachine.registerCommand('has-focus', new HasFocusCommand(this.commandsData));
    this.stateMachine.registerCommand('no-focus', new NoFocusCommand(this.commandsData));

    this.stateMachine.registerCommand('delete', new DeleteCommand(this.commandsData));
    this.stateMachine.registerCommand('zoom-all', new ZoomAllCommand(this.commandsData));
    this.stateMachine.registerCommand('zoom-in', new ZoomInCommand(this.commandsData));
    this.stateMachine.registerCommand('zoom-out', new ZoomOutCommand(this.commandsData));
    this.stateMachine.registerCommand('cleanup-uncompleted', new CleanupUncompletedCommand(this.commandsData));
    this.stateMachine.registerCommand('check-dragged', new CheckDraggedCommand(this.commandsData));
    this.stateMachine.registerCommand('save', new SaveCommand(this.commandsData));
  }

  loadDrawItems(): void {
    for (const s of this.commandsData.model.states){
      this.drawItems.push(new StateDraw(this.commandsData.model, s));
    }

    for (const t of this.commandsData.model.transitions){
      this.drawItems.push(new TransitionDraw(this.commandsData.model, t));
    }
  }

  widthChanged(width: number): void {
    this.viewControl.width = width;
  }

  heightChanged(height: number): void {
    this.viewControl.height = height;
  }

  onDown(data: SurfaceData): void {
    this.stateMachine.onevent('down', data);
  }

  onMove(data: SurfaceData): void {
    this.stateMachine.onevent('move', data);
  }

  onUp(data: SurfaceData): void {
    this.stateMachine.onevent('up', data);
  }

  onWheel(data: SurfaceData): void {
    this.stateMachine.onevent('wheel', data);
  }
}
