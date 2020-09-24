import { Instruction } from "./instruction";
export interface InstructionProcessor {
    execute(instruction: Instruction): any;
    undo(instruction: Instruction): any;
    aggregate(instruction: Instruction, prevInstruction: Instruction): boolean;
    preRedo(instruction: Instruction): any;
}
