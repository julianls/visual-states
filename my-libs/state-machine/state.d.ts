import { Action } from './action';
import { CommandContainer } from './command-container';
export declare abstract class State {
    name: string;
    entryActions: Action[];
    exitActions: Action[];
    constructor(name: string);
    abstract process(event: string, data: any, commands: CommandContainer): State;
    abstract onEnter(commands: CommandContainer): any;
    abstract onExit(commands: CommandContainer): any;
}
