export class Downsampler {
  readonly ratioWeight: number;

  private tailExists = false;
  private lastOutput = 0;
  private lastWeight = 0;

  constructor(from: number, to: number) {
    this.ratioWeight = from / to;
  }

  calculateMaxOutputSize(inputLength: number): number {
    return Math.ceil(inputLength / this.ratioWeight);
  }

  downSample(input: Float32Array, output: Float32Array): Float32Array {
    if (output.length === 0) {
      return output.subarray(0, 0);
    }

    let weight = 0;
    let output0 = 0;
    let actualPosition = 0;
    let amountToNext = 0;
    let alreadyProcessedTail = !this.tailExists;
    this.tailExists = false;
    const outputBuffer = output;
    let currentPosition = 0;
    let outputOffset = 0;
    while (actualPosition < input.length) {
      if (alreadyProcessedTail) {
        weight = this.ratioWeight;
        output0 = 0;
      } else {
        weight = this.lastWeight;
        output0 = this.lastOutput;
        alreadyProcessedTail = true;
      }
      while (weight > 0 && actualPosition < input.length) {
        amountToNext = 1 + actualPosition - currentPosition;
        if (weight >= amountToNext) {
          output0 += input[actualPosition++] * amountToNext;
          currentPosition = actualPosition;
          weight -= amountToNext;
        } else {
          output0 += input[actualPosition] * weight;
          currentPosition += weight;
          weight = 0;
          break;
        }
      }
      if (weight <= 0) {
        outputBuffer[outputOffset++] = output0 / this.ratioWeight;
      } else {
        this.lastWeight = weight;
        this.lastOutput = output0;
        this.tailExists = true;
        break;
      }
    }
    return output.subarray(0, outputOffset);
  }

  reset(): void {
    this.tailExists = false;
    this.lastOutput = 0;
    this.lastWeight = 0;
  }
}
