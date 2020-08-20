import { CommandContainer } from './command-container';
export declare class Action {
    commandName: string;
    constructor(commandName: string);
    execute(data: any, commands: CommandContainer): void;
}
