import { StateMachine } from 'my-libs/state-machine';

export class MainStateMachine extends StateMachine {
    constructor() {
      super();

      this.addEntryState();


      // set default sate
      this.setState(this.states[1]);
    }
}
