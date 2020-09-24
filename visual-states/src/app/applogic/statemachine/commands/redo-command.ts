import { CommandsData } from './command-data';
import { IBaseCommand } from 'my-libs/state-machine';

export class RedoCommand implements IBaseCommand {
  constructor(private commandsData: CommandsData) {

  }

  public execute(data: any): boolean {
    this.commandsData.instructionSet.redo();
    this.commandsData.reloadDrawItems();
    return true;
  }
}
