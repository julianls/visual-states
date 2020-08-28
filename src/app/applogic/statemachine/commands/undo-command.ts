import { CommandsData } from './command-data';
import { IBaseCommand } from 'my-libs/state-machine';

export class UndoCommand implements IBaseCommand {
  constructor(private commandsData: CommandsData) {

  }

  public execute(data: any): boolean {
    this.commandsData.instructionSet.undo();
    this.commandsData.invalidateModelDrawing();
    return true;
  }
}
