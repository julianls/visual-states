import { Container } from '../model/container';
import { StateMachineModel } from '../../applogic/datamodel/state-machine';

export class BlockchainGenerator {
    private container: Container;

    constructor(private model: StateMachineModel) {
    }

    public generate(): Container {
        // todo: generate
        return this.container;
    }
  }
