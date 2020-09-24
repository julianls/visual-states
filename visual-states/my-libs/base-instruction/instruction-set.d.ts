import { Instruction } from "./instruction";
import { InstructionProcessor } from "./instruction-processor";
export declare class InstructionSet {
    position: number;
    instructions: Instruction[];
    instructionProcessor: InstructionProcessor;
    createAndExecute(id: string, data: string, description: string): void;
    executeAllAndBreak(instructions: Instruction[]): void;
    executeAll(instructions: Instruction[]): void;
    execute(instruction: Instruction): void;
    setBreak(): void;
    hasUndo(): boolean;
    undo(): void;
    undoUncompleted(): void;
    hasRedo(): boolean;
    redo(): void;
}
