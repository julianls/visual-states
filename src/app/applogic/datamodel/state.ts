import { Point } from 'my-libs/base-geometry';
import { TransitionModel } from './transition';

export class StateModel {
  public id = '';
  public name = '';
  public metadata = '';
  public position: Point = new Point(0, 0);
  public stateType = 0;
  public entryActions = '';
  public exitActions = '';

  // composite state data
  public states: StateModel[] = [];
  public transitions: TransitionModel[] = [];

  constructor() {
  }

  public copyProperties(source: StateModel): void {
    this.id = source.id;
    this.name = source.name;
    this.metadata = source.metadata;
    this.position = source.position;
    this.stateType = source.stateType;
    this.entryActions = source.entryActions;
    this.exitActions = source.exitActions;
  }
}
