import { Container } from '../model/container';
import { StateMachineModel } from '../../applogic/datamodel/state-machine';
import { StateModel } from '../../applogic/datamodel/state';
import { ContainerElement } from '../model/element';
import { TransitionModel } from '../../applogic/datamodel/transition';

export class StateGenerator {
    private container: Container;
    private ident = '   ';

    constructor(private model: StateMachineModel) {
    }

    public generate(): Container {
        this.container = new Container();
        this.container.name = this.model.name;

        // todo: generate
        this.createCompositeStateFile(this.model);

        return this.container;
    }

    private createCompositeStateFile(state: StateModel): void {
        const file = new ContainerElement();
        file.name = state.name + 'State.ts';

        this.addHeaderAndContructorStart(file, state);

        for (const childState of state.states){
            this.addStateDeclaration(file, state, childState);
        }

        file.content += '\r\n';

        for (const childTransition of state.transitions){
            this.addTransitionDeclaration(file, state, childTransition);
        }

        this.addFooterAndContructorEnd(file, state);

        this.container.elements.push(file);

        for (const childState of state.states){
            if (childState.states.length > 0){
                this.createCompositeStateFile(childState);
            }
        }
    }

    private addHeaderAndContructorStart(file: ContainerElement, stateContext: StateModel): void {
        file.content = 'import { StateMachine } from \'my-libs/state-machine\';\r\n';
        for (const childState of stateContext.states){
            if (childState.states.length > 0){
                file.content += 'import { ' + childState.name + 'State } from \'./' + childState.name.toLowerCase() + ';\r\n';
            }
        }

        file.content += '\r\n';
        file.content += 'export class ' + stateContext.name + 'State extends StateMachine {\r\n';
        file.content += '    constructor() {\r\n';
        file.content += '      super();\r\n';
        file.content += '\r\n';
    }

    private addStateDeclaration(file: ContainerElement, stateContext: StateModel, childState: StateModel): void {
        switch (childState.stateType){
            case 0: {
                if (childState.states.length === 0){
                    file.content += '      this.addState(\'' + childState.name + '\');\r\n';
                } else {
                    file.content += '      this.states.push(new ' + childState.name + 'State());\r\n';
                }
                break;
            }
            case 1: {
                file.content += '      this.addEntryState();\r\n';
                break;
            }
            case 2: {
                file.content += '      this.addExitState();\r\n';
                break;
            }
        }
    }

    private addTransitionDeclaration(file: ContainerElement, stateContext: StateModel, childTransition: TransitionModel): void {
        const trigger = childTransition.trigger;
        const sourceState = stateContext.findStateById(childTransition.sourceStateId);
        const targetSate = stateContext.findStateById(childTransition.targetStateId);
        const sourceStateName = sourceState ? sourceState.name : '';
        const targetSateName = targetSate ? targetSate.name : '';
        const action = childTransition.actions;
        const condition = childTransition.condition;

        file.content += '      this.addTransition(\'' +
            trigger + '\', \'' +
            sourceStateName + '\', \'' +
            targetSateName + '\', \'' +
            action + '\', \'' +
            condition + '\');\r\n';
    }

    private addFooterAndContructorEnd(file: ContainerElement, stateContext: StateModel): void {
        file.content += '\r\n';
        file.content += '   }\r\n';
        file.content += '}\r\n';
    }
}

