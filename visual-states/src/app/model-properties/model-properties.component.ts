import { Component, OnInit, Input } from '@angular/core';
import { CommandsData } from '../applogic/statemachine/commands/command-data';
import { StateMachine } from 'my-libs/state-machine';
import { StateModel } from '../applogic/datamodel/state';
import { TransitionModel } from '../applogic/datamodel/transition';
import { StateMachineModel } from '../applogic/datamodel/state-machine';

@Component({
  selector: 'app-model-properties',
  templateUrl: './model-properties.component.html',
  styleUrls: ['./model-properties.component.scss']
})
export class ModelPropertiesComponent implements OnInit {
  @Input() commandsData: CommandsData = null;
  @Input() stateMachine: StateMachine;
  @Input() isEditable = false;

  public objectType = -1;
  public stateProperties: StateModel;
  public transitionProperties: TransitionModel;
  public machineProperties: StateMachineModel;

  constructor() { }

  ngOnInit(): void {
  }

  getProperties(): string {
    if (this.commandsData.selectedItems.states.length === 1) {
      const state = this.commandsData.selectedItems.states[0];
      return 'State:' + state.id;
    } else if (this.commandsData.selectedItems.transitions.length === 1) {
      const transition = this.commandsData.selectedItems.transitions[0];
      return 'Transition:' + transition.id;
    } else if (this.commandsData.model)  {
      return 'Machine:' + this.commandsData.model.id;
    }
  }

  private loadEditPorperties(): void {
    this.stateProperties = null;
    this.transitionProperties = null;
    this.machineProperties = null;

    if (this.commandsData.selectedItems.states.length === 1) {
      this.stateProperties = new StateModel();
      this.stateProperties.copyProperties(this.commandsData.selectedItems.states[0]);
      this.objectType = 1;
    } else if (this.commandsData.selectedItems.transitions.length === 1) {
      this.transitionProperties = new TransitionModel();
      this.transitionProperties.copyProperties(this.commandsData.selectedItems.transitions[0]);
      this.objectType = 2;
    } else if (this.commandsData.model) {
      this.machineProperties = new StateMachineModel();
      this.machineProperties.copyProperties(this.commandsData.model);
      this.objectType = 0;
    }
  }

  public isEdit(): boolean {
    return this.stateMachine && this.stateMachine.activeState.name === 'edit-properties-state';
  }

  public onEdit(): void {
    this.loadEditPorperties();
    this.stateMachine.onevent('edit-properties', this.objectType);
  }

  public onApplyEdit(): void {
    switch (this.objectType) {
      case 1: // state
        this.stateMachine.onevent('set-state-properties', this.stateProperties);
        break;
      case 2: // transition
        this.stateMachine.onevent('set-transition-properties', this.transitionProperties);
        break;
      default: // machine
        this.stateMachine.onevent('set-machine-properties', this.machineProperties);
        break;
    }
  }

  public onCancelEdit(): void {
    this.stateMachine.onevent('cancel-edit', null);
  }
}
