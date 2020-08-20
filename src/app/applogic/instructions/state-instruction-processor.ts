import { InstructionProcessor, Instruction } from 'my-libs/base-instruction';
import { CommandsData } from '../statemachine/commands/command-data';

export class ModelInstructionProcessor implements InstructionProcessor {
    constructor(public commandsData: CommandsData) {
    }

    execute(instruction: Instruction): void {
      const data = instruction.data ? JSON.parse(instruction.data) : null;
    }

    undo(instruction: Instruction): void {
      const data = instruction.data ? JSON.parse(instruction.data) : null;
    }

    preRedo(instruction: Instruction): void {
    }

  public aggregate(instruction: Instruction, prevInstruction: Instruction): boolean {
    return false;
  }
}
