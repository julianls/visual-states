import { CompositeState } from 'my-libs/state-machine';

export class ModelEditState extends CompositeState {
  constructor() {
    super('model-edit');

    this.addEntryState();
    this.addState('focus');
    this.addState('focus-down');
    this.addState('waitmodify');
    this.addState('modify');
    this.addState('movearea');
    this.addExitState();

    this.addTransition('move', 'entry', 'focus');
    this.addTransition('move', 'focus', 'focus', 'update-focus');
    this.addTransition('down', 'focus', 'focus-down', 'update-focus');
    this.addTransition('dblclick', 'focus', 'focus', 'change-root');
    this.addTransition('wheel', 'focus', 'focus', 'zoom-area');
    this.addTransition('delete', 'focus', 'focus', 'delete');
    this.addTransition('zoom-all', 'focus', 'focus', 'zoom-all');
    this.addTransition('zoom-in', 'focus', 'focus', 'zoom-in');
    this.addTransition('zoom-out', 'focus', 'focus', 'zoom-out');
    this.addTransition('save', 'focus', 'focus', 'save');

    this.addTransition('move', 'focus-down', 'waitmodify', 'update-active', 'has-focus');
    this.addTransition('move', 'focus-down', 'movearea', 'update-active', 'no-focus');
    this.addTransition('up', 'focus-down', 'focus', 'update-active');

    this.addTransition('move', 'waitmodify', 'modify', 'move-active', 'check-dragged');
    this.addTransition('escape', 'waitmodify', 'focus');
    this.addTransition('up', 'waitmodify', 'focus');

    this.addTransition('move', 'modify', 'modify', 'move-active');
    this.addTransition('escape', 'modify', 'focus', 'cleanup-uncompleted');
    this.addTransition('up', 'modify', 'focus', 'end-move-active', 'update-state-focus');

    this.addTransition('move', 'movearea', 'movearea', 'move-area');
    this.addTransition('up', 'movearea', 'focus');
  }
}
