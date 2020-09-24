import { Component, OnInit, Input, HostListener } from '@angular/core';
import { StateMachine } from 'my-libs/state-machine';

@Component({
  selector: 'app-model-tools',
  templateUrl: './model-tools.component.html',
  styleUrls: ['./model-tools.component.scss']
})
export class ModelToolsComponent implements OnInit {
  @Input() stateMachine: StateMachine;

  constructor() { }

  ngOnInit(): void {
  }

  isSelectState(): boolean {
    return this.stateMachine.activeState.name === 'model-edit';
  }

  onSelectState(): void {
    this.stateMachine.onevent('button-select', null);
  }

  isAddStateState(): boolean {
    return this.stateMachine.activeState.name === 'new-state-state';
  }

  onAddStateState(): void {
    this.stateMachine.onevent('button-new-state', null);
  }

  isAddTransitionState(): boolean {
    return this.stateMachine.activeState.name === 'new-transition-state';
  }

  onAddTransitionState(): void {
    this.stateMachine.onevent('button-new-transition', null);
  }

  @HostListener('document:keydown.control.delete')
  onDelete(): void {
    this.stateMachine.onevent('delete', null);
  }

  @HostListener('document:keydown.control.space')
  onZoomAll(): void {
    this.stateMachine.onevent('zoom-all', null);
  }

  @HostListener('document:keydown.control.arrowup')
  onZoomIn(): void {
    this.stateMachine.onevent('zoom-in', null);
  }

  @HostListener('document:keydown.control.arrowdown')
  onZoomOut(): void {
    this.stateMachine.onevent('zoom-out', null);
  }
}
