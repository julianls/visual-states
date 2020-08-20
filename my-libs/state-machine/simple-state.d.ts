import { State } from './state';
import { CommandContainer } from './command-container';
export declare class SimpleState extends State {
    isExit: boolean;
    constructor(name: string, isExit?: boolean);
    process(event: string, data: any, commands: CommandContainer): State;
    onEnter(commands: CommandContainer): void;
    onExit(commands: CommandContainer): void;
}
