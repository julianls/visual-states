import { CommandsData } from './command-data';
import { IBaseCommand } from 'my-libs/state-machine';
import { ModelInstructionProcessor } from '../../instructions/state-instruction-processor';

export class DeleteCommand implements IBaseCommand {
  constructor(private commandsData: CommandsData) {

  }

  public execute(data: any): boolean {
    // if (this.commandsData.selectedItems.pieces.length == 1 && this.commandsData.selectedItems.points.length == 1) {
    //   let piece = this.commandsData.selectedItems.pieces[0];
    //   let pieceIdx = this.commandsData.style.StylePieces.indexOf(piece);

    //   if (this.commandsData.selectedItems.lines.length > 0) {
    //     let line = this.commandsData.selectedItems.lines[0];
    //     let contourIdx = this.commandsData.selectedItems.contours.length > 0 ?
    //       piece.Geometry.Contours.indexOf(this.commandsData.selectedItems.contours[0]) : -1;
    //     let lineIdx = contourIdx >= 0 ? ModelCommandsData.findPolylineIdx(piece.Geometry.Contours[contourIdx], line) :
    //       piece.Geometry.InternalLines.indexOf(line);
    //     let idx = line.Points.indexOf(this.commandsData.selectedItems.points[0]);
    //     let delPt = this.commandsData.selectedItems.points[0];
    //     let deletePointInstruction = ModelInstructionProcessor.createDeletePointInstruction(pieceIdx, contourIdx, lineIdx, idx);
    //     this.commandsData.instructionSet.execute(deletePointInstruction);

    //     //TODO:Put this in instruction
    //     if (line.Points.length > 0 && delPt === line.Points[line.Points.length - 1]) {
    //       let setPointAtInstruction = ModelInstructionProcessor.createSetPointAtInstruction(
    //         pieceIdx, contourIdx, lineIdx, line.Points.length - 1,
    //         pieceIdx, contourIdx, lineIdx, 0);
    //       this.commandsData.instructionSet.execute(setPointAtInstruction);
    //     }

    //     if (line.Points.length == 0) {
    //       let deleteLineInstruction = ModelInstructionProcessor.createDeleteLineInstruction(pieceIdx, contourIdx, lineIdx);
    //       this.commandsData.instructionSet.execute(deleteLineInstruction);
    //     }

    //     if (this.commandsData.selectedItems.contours.length > 0 &&
    //       this.commandsData.selectedItems.contours[0].Lines.length == 0) {
    //       let deleteContourInstruction = ModelInstructionProcessor.createDeleteControurInstruction(pieceIdx, contourIdx);
    //       this.commandsData.instructionSet.execute(deleteContourInstruction);
    //     }
    //   } else {
    //     let idx = this.commandsData.selectedItems.pieces[0].Geometry.InternalPoints.indexOf(this.commandsData.selectedItems.points[0]);
    //     let deletePointInstruction = ModelInstructionProcessor.createDeleteInternalPointInstruction(pieceIdx, idx);
    //     this.commandsData.instructionSet.execute(deletePointInstruction);
    //   }
    //   this.commandsData.instructionSet.setBreak();
    //   this.commandsData.selectedItems.clear();
    //   this.commandsData.invalidateModelDrawing();
    // } else if (this.commandsData.selectedItems.pieces.length == 1) {
    //   let idx = this.commandsData.style.StylePieces.indexOf(this.commandsData.selectedItems.pieces[0]);
    //   let deletePieceInstruction = ModelInstructionProcessor.createDeletePieceInstruction(idx);
    //   this.commandsData.instructionSet.execute(deletePieceInstruction);
    //   this.commandsData.instructionSet.setBreak();
    //   this.commandsData.selectedItems.clear();
    //   this.commandsData.invalidateModelDrawing();
    // }

    return true;
  }
}
