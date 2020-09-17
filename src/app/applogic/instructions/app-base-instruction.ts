import { CommandsData } from '../statemachine/commands/command-data';
import { Instruction } from 'my-libs/base-instruction';

export abstract class AppBaseInstruction extends Instruction {
  constructor(id: string, data: string, description: string, timestamp: string) {
    super(id, data, description, timestamp);
  }

  public abstract execute(commandsData: CommandsData): void;
  public abstract undo(commandsData: CommandsData): void;
  public abstract preRedo(commandsData: CommandsData): void;

  public agregate(instruction: Instruction): boolean {
    return false;
  }
}
