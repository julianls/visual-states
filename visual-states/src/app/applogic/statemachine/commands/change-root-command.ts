import { CommandsData } from './command-data';
import { IBaseCommand } from 'my-libs/state-machine';
import { StateModel } from '../../datamodel/state';

export class ChangeRootCommand implements IBaseCommand {
  constructor(private commandsData: CommandsData) {

  }

  public execute(data: any): boolean {
    let activeRoot: StateModel = this.commandsData.activeRoot;

    if (this.commandsData.selectedItems.states.length > 0){
        activeRoot = this.commandsData.selectedItems.states[0];
    } else if (!this.commandsData.selectedItems.hasItems()){
        activeRoot = this.commandsData.getActiveRootParent();
    }

    if (activeRoot !== this.commandsData.activeRoot){
        this.commandsData.activeRoot = activeRoot;
        this.commandsData.reloadDrawItems();
    }

    return true;
  }
}
