import { IBaseCommand } from './base-command';
export declare class CommandContainer {
    private commands;
    register(id: string, command: IBaseCommand): void;
    execute(id: string, data: any): boolean;
}
