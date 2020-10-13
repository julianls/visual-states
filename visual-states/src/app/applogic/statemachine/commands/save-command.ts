import { CommandsData } from './command-data';
import { IBaseCommand } from 'my-libs/state-machine';
import { Machine } from 'src/app/core';
import { Guid } from '../../common/guid';

export class SaveCommand implements IBaseCommand {
  constructor(private commandsData: CommandsData) {

  }

  public execute(data: any): boolean {
    this.commandsData.isRequesting = true;

    const isNew = this.commandsData.model.id === 'new';
    if (isNew){
      this.commandsData.model.id = Guid.newGuid();
    }

    const machine: Machine = {
      Id: this.commandsData.model.id,
      Owner: '',
      Name: this.commandsData.model.name,
      Path: '',
      Description: '',
      Content: JSON.stringify(this.commandsData.model)
    };

    if (isNew){
      this.commandsData.dataService.createMachine(machine)
      .subscribe(obj => {

      });
    } else {
      this.commandsData.dataService.updateMachine(machine)
        .subscribe(obj => {

        });
    }

    return true;
  }
}
