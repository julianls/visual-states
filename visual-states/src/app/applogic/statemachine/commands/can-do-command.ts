import { CommandsData } from './command-data';
import { IBaseCommand } from 'my-libs/state-machine';

export class CanDoCommand implements IBaseCommand {
  constructor(private commandsData: CommandsData) {

  }

  public execute(isUndo: boolean): boolean {
    return isUndo ? this.commandsData.instructionSet.hasUndo() : this.commandsData.instructionSet.hasRedo();
  }
}
