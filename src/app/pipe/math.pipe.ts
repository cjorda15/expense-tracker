import { Pipe, PipeTransform } from '@angular/core';

// export enum MathOperation {
//   Add = 'add',
//   Subtract = 'subtract',
//   Multiply = 'multiply',
//   Divide = 'divide',
//   Min = 'min',
//   Max = 'max',
// }

@Pipe({
  name: 'math'
})
export class MathPipe implements PipeTransform {
  transform(value: number, operation: string, operand: number): number {
    switch (operation) {
      case 'add':
        return value + operand;
      case 'subtract':
        return value - operand;
      case 'multiply':
        return value * operand;
      case 'divide':
        if (operand === 0) {
          throw new Error('Division by zero is not allowed.');
        }
        return value / operand;
      case 'min':
        return Math.min(value, operand);
      case 'max':
        return Math.max(value, operand);
      default:
        throw new Error(`Unsupported operation: ${operation}`);
    }
  }
}
