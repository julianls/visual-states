import { InstructionProcessor, Instruction } from 'my-libs/base-instruction';
import { CommandsData } from '../statemachine/commands/command-data';
import { StateModel } from '../datamodel/state';
import { TransitionModel } from '../datamodel/transition';
import { AppBaseInstruction } from './app-base-instruction';
import { MoveTransitionInstruction } from './move-transition-instruction';
import { MoveStateInstruction } from './move-state-instruction';
import { DeleteTransitionInstruction } from './delete-transition-instruction';
import { DeleteStateInstruction } from './delete-state-instruction';
import { AddTransitionInstruction } from './add-transition-instruction';
import { AddStateInstruction } from './add-state-instruction';

export class ModelInstructionProcessor implements InstructionProcessor {
  static createMoveTransitionInstruction(transition: TransitionModel, x: number, y: number): Instruction {
    return new MoveTransitionInstruction(transition, x, y);
  }

  static createMoveStateInstruction(state: StateModel, x: number, y: number): Instruction {
    return new MoveStateInstruction(state, x, y);
  }

  static createDeleteTransitionInstruction(transition: TransitionModel): Instruction {
    return new DeleteTransitionInstruction(transition);
  }

  static createDeleteStateInstruction(state: StateModel): Instruction {
    return new DeleteStateInstruction(state);
  }

  static createAddTransitionInstruction(x: number, y: number): Instruction {
    return new AddTransitionInstruction(x, y);
  }

  static createAddStateInstruction(x: number, y: number): Instruction {
    return new AddStateInstruction(x, y);
  }

  constructor(public commandsData: CommandsData) {
  }

  execute(instruction: Instruction): void {
    if ((instruction as AppBaseInstruction).execute !== undefined){
      (instruction as AppBaseInstruction).execute(this.commandsData);
    }
  }

  undo(instruction: Instruction): void {
    if ((instruction as AppBaseInstruction).undo !== undefined){
      (instruction as AppBaseInstruction).undo(this.commandsData);
    }
  }

  preRedo(instruction: Instruction): void {
    if ((instruction as AppBaseInstruction).preRedo !== undefined){
      (instruction as AppBaseInstruction).preRedo(this.commandsData);
    }
  }

  public aggregate(instruction: Instruction, prevInstruction: Instruction): boolean {
    return false;
  }
}
