import { ContainerElement } from './element';

export class Container extends ContainerElement {
  public elements: ContainerElement[] = [];

  constructor() {
    super();
  }
}
