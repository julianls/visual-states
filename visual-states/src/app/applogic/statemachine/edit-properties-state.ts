import { CompositeState } from 'my-libs/state-machine';

export class EditPropertiesState extends CompositeState {
  constructor() {
    super('edit-properties-state');

    this.addEntryState();
    this.addExitState();

    this.addTransition('set-state-properties', 'entry', 'exit', 'set-state-properties');
    this.addTransition('set-transition-properties', 'entry', 'exit', 'set-transition-properties');
    this.addTransition('set-machine-properties', 'entry', 'exit', 'set-machine-properties');

    this.addTransition('cancel-edit', 'entry', 'exit');
  }
}
