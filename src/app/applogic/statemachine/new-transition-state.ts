import { CompositeState, Action } from 'my-libs/state-machine';

export class NewTransitionState extends CompositeState {
  constructor() {
    super('new-transition-state');

    this.addEntryState();
    this.addState('focus-state');
    this.addState('add-transition');
    this.addState('finish-transition');
    this.addExitState();

    this.addTransition('move', 'entry', 'focus-state', '');
    this.addTransition('down', 'focus-state', 'add-transition', 'update-focus');
    this.addTransition('up', 'add-transition', 'finish-transition', 'add-transition');

    this.addTransition('move', 'finish-transition', 'finish-transition', 'move-active');
    this.addTransition('down', 'finish-transition', 'finish-transition', 'update-focus');
    this.addTransition('up', 'finish-transition', 'focus-state', 'end-move-active');

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
