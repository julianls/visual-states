import { StateModel } from './state';
import { TransitionModel } from './transition';

export class ItemsContainer {
  public states: StateModel[] = [];
  public transitions: TransitionModel[] = [];

  public clear(): void {
    this.states = [];
    this.transitions = [];
  }

  public append(source: ItemsContainer): void {
    for (const item of source.states) {
      this.states.push(item);
    }

    for (const item of source.transitions) {
      this.transitions.push(item);
    }
  }
}
