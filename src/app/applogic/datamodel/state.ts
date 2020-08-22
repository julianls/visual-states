import { Point } from 'my-libs/base-geometry';
import { TransitionModel } from './transition';

export class StateModel {
  public id: string;
  public name: string;
  public position: Point = new Point(0, 0);
  public stateType = 0;
  public entryActions: string[] = [];
  public exitActions: string[] = [];

  // composite state data
  public states: StateModel[] = [];
  public transitions: TransitionModel[] = [];

  constructor() {
  }
}
