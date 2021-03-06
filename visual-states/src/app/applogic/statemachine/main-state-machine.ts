import { StateMachine } from 'my-libs/state-machine';
import { ModelEditState } from './model-edit-state';
import { NewStateState } from './new-state-state';
import { NewTransitionState } from './new-transition-state';
import { EditPropertiesState } from './edit-properties-state';

export class MainStateMachine extends StateMachine {
    constructor() {
      super();

      this.addEntryState();
      this.states.push(new ModelEditState());
      this.states.push(new NewStateState());
      this.states.push(new NewTransitionState());
      this.states.push(new EditPropertiesState());

      this.addTransition('', 'entry', 'model-edit');

      // default state
      this.addTransition('button-new-state', 'model-edit', 'new-state-state');
      this.addTransition('button-new-transition', 'model-edit', 'new-transition-state');
      this.addTransition('edit-properties', 'model-edit', 'edit-properties-state');

      // add transition state
      this.addTransition('button-select', 'new-transition-state', 'model-edit');
      this.addTransition('button-new-state', 'new-transition-state', 'new-state-state');
      this.addTransition('escape', 'new-transition-state', 'model-edit');

      // add state state
      this.addTransition('button-select', 'new-state-state', 'model-edit');
      this.addTransition('button-new-transition', 'new-state-state', 'new-transition-state');
      this.addTransition('escape', 'new-state-state', 'model-edit');

      // edit properties state
      this.addTransition('escape', 'edit-properties-state', 'model-edit');

      // set default sate
      this.setState(this.states[1]);
    }
}
