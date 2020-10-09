import { CommandsData } from './command-data';
import { IBaseCommand } from 'my-libs/state-machine';
import { SurfaceData } from 'my-libs/surface-draw';
import { StateGenerator } from '../../../generators/state/state-generator';

export class GenerateStatesCommand implements IBaseCommand {
  constructor(private commandsData: CommandsData) {

  }

  public execute(data: SurfaceData): boolean {
    const generator = new StateGenerator(this.commandsData.model);
    this.commandsData.fileData = generator.generate();
    this.commandsData.activeContainerElement = this.commandsData.fileData.elements.length > 0 ?
    this.commandsData.fileData.elements[0] : null;
    return true;
  }
}
