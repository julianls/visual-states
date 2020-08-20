import { SimpleState } from './simple-state';
import { State } from './state';
import { Transition } from './transition';
import { CommandContainer } from './command-container';
export declare class CompositeState extends SimpleState {
    states: State[];
    transitions: Transition[];
    entryState: State;
    activeState: State;
    constructor(name: string);
    process(event: string, data: any, commands: CommandContainer): State;
    onEnter(commands: CommandContainer): void;
    onExit(commands: CommandContainer): void;
    setState(state: State, commands?: CommandContainer): void;
    addState(name: string): SimpleState;
    addEntryState(): SimpleState;
    addExitState(name?: string): SimpleState;
    addCompositeState(name: string): CompositeState;
    addTransition(event: string, sourceState: string, targetState: string, actionCommand?: string, conditionCommand?: string): Transition;
    findState(name: string): State;
}
