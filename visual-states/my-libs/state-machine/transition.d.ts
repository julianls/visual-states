import { Action } from './action';
import { Condition } from './condition';
import { State } from './state';
import { CompositeState } from './composite-state';
import { CommandContainer } from './command-container';
export declare class Transition {
    event: string;
    actions: Action[];
    condition: Condition;
    sourceState: State;
    targetState: State;
    constructor(event: string);
    isValid(event: string, data: any, commands: CommandContainer): boolean;
    execute(context: CompositeState, data: any, commands: CommandContainer): State;
}
