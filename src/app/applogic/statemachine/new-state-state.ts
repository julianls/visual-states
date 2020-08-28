import { CompositeState, Action } from 'my-libs/state-machine';

export class NewStateState extends CompositeState {
  constructor() {
    super('new-state-state');

    this.addEntryState();
    this.addState('focus-state');
    this.addState('add-state');
    this.addExitState();

    this.addTransition('move', 'entry', 'focus-state', '');
    this.addTransition('down', 'focus-state', 'add-state');
    this.addTransition('up', 'add-state', 'focus-state', 'add-state');

    this.addTransition('wheel', 'focus-state', 'focus-state', 'zoom-area');
    this.addTransition('zoom-all', 'focus-state', 'focus-state', 'zoom-all');
    this.addTransition('zoom-in', 'focus-state', 'focus-state', 'zoom-in');
    this.addTransition('zoom-out', 'focus-state', 'focus-state', 'zoom-out');
    this.addTransition('undo', 'focus-state', 'focus-state', 'undo');
    this.addTransition('redo', 'focus-state', 'focus-state', 'redo');
    this.addTransition('save', 'focus-state', 'focus-state', 'save');

    this.exitActions.push(new Action('cleanup-uncompleted'));
  }
}
