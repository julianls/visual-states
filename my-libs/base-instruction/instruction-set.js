'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.InstructionSet = void 0;
var instruction_1 = require('./instruction');
var InstructionSet = /** @class */ (function () {
  function InstructionSet() {
    this.position = 0;
    this.instructions = [];
  }
  InstructionSet.prototype.createAndExecute = function (id, data, description) {
    var instruction = new instruction_1.Instruction(id, data, description, '');
    this.execute(instruction);
  };
  InstructionSet.prototype.executeAllAndBreak = function (instructions) {
    this.executeAll(instructions);
    this.setBreak();
  };
  InstructionSet.prototype.executeAll = function (instructions) {
    for (var _i = 0, instructions_1 = instructions; _i < instructions_1.length; _i++) {
      var item = instructions_1[_i];
      this.execute(item);
    }
  };
  InstructionSet.prototype.execute = function (instruction) {
    if (this.position < this.instructions.length - 1) {
      if (this.instructions[this.position].id === 'break') this.position++;
      this.instructions.splice(this.position, this.instructions.length - this.position);
    }
    this.instructionProcessor.execute(instruction);
    if (
      this.instructions.length > 0 &&
      this.instructionProcessor.aggregate(instruction, this.instructions[this.instructions.length - 1])
    ) {
      // TODO: check aggregation
    } else {
      this.position = this.instructions.push(instruction) - 1;
    }
  };
  InstructionSet.prototype.setBreak = function () {
    this.createAndExecute('break', '', '');
  };
  InstructionSet.prototype.hasUndo = function () {
    return this.position > 0;
  };
  InstructionSet.prototype.undo = function () {
    var startPosition = this.position;
    if (this.instructions[this.position].id === 'break' && this.position > 0) startPosition--;
    for (var i = startPosition; i >= 0; i--) {
      var instruction = this.instructions[i];
      this.position = i;
      if (instruction.id === 'break') break;
      else this.instructionProcessor.undo(instruction);
    }
  };
  InstructionSet.prototype.undoUncompleted = function () {
    if (this.instructions.length > 0 && this.instructions[this.position].id !== 'break') {
      this.undo();
      if (this.position < this.instructions.length - 1) {
        if (this.instructions[this.position].id === 'break') this.position++;
        this.instructions.splice(this.position, this.instructions.length - this.position);
        this.position = this.instructions.length - 1;
      }
    }
  };
  InstructionSet.prototype.hasRedo = function () {
    return this.position < this.instructions.length - 1;
  };
  InstructionSet.prototype.redo = function () {
    var startPosition = this.position;
    if (this.instructions[this.position].id === 'break' && this.position < this.instructions.length - 1)
      startPosition++;
    for (var i = startPosition; i < this.instructions.length; i++) {
      var instruction = this.instructions[i];
      this.position = i;
      if (instruction.id === 'break') break;
      else {
        this.instructionProcessor.preRedo(instruction);
        this.instructionProcessor.execute(instruction);
      }
    }
  };
  return InstructionSet;
})();
exports.InstructionSet = InstructionSet;
