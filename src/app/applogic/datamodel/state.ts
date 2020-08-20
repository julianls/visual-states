import { Point } from 'my-libs/base-geometry';

export class StateModel {
  public id: string;
  public position: Point = new Point(0, 0);

  constructor() {
  }
}
