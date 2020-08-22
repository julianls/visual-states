import { CommandsData } from './command-data';
import { IBaseCommand } from 'my-libs/state-machine';

export class NoFocusCommand implements IBaseCommand {
  constructor(private commandsData: CommandsData) {

  }

  public execute(data: any): boolean {

    return true;
  }
}
