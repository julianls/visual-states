import { CompositeState } from './composite-state';
import { IBaseCommand } from './base-command';
export declare class StateMachine extends CompositeState {
    private commands;
    constructor();
    registerCommand(id: string, command: IBaseCommand): void;
    onevent(event: string, data: any): void;
    executeCommand(id: string, data: any): boolean;
}
