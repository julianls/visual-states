import { CommandContainer } from './command-container';
export declare class Condition {
    commandName: string;
    constructor(commandName: string);
    isValid(event: string, data: any, commands: CommandContainer): boolean;
}
