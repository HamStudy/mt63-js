import { DspSeq, dspCmpx } from './dsp';

export class DspDelayLine {
  public line: dspCmpx[] = []; // line storage
  public dspDelay: number; // how many (at least) backward samples are stored
  public lineSize: number; // allocated size
  public dataLen: number; // length of the valid data
  public inpPtr: dspCmpx[]; // The line array (in C++ this is a pointer into line)
  public inpOffset = 0; // offset into line for the most recent input
  public inpLen: number; // number of samples for the most recent input

  constructor(maxDspDelay: number, maxSize = 0) {
    this.lineSize = maxSize;
    if (this.lineSize < 2 * maxDspDelay) {
      this.lineSize = 2 * maxDspDelay;
    }
    this.dataLen = maxDspDelay;
    this.dspDelay = maxDspDelay;
    this.line = new Array<dspCmpx>(this.lineSize);
    this.clearArray(this.line, this.lineSize);
    this.inpOffset = this.dataLen;
    this.inpPtr = this.line; // In TypeScript, we'll use the whole array with offset
    this.inpLen = 0;
  }

  public process(inp: dspCmpx[], len: number): number {
    if (this.dataLen + len > this.lineSize) {
      this.moveArray(
        this.line,
        this.line.slice(this.dataLen - this.dspDelay),
        this.dspDelay
      );
      this.dataLen = this.dspDelay;
    }
    if (this.dataLen + len > this.lineSize) {
      return -1;
    }
    // Copy new data to the line
    for (let i = 0; i < len; i++) {
      this.line[this.dataLen + i] = inp[i];
    }
    // Update offset to point to the start of newly added data
    this.inpOffset = this.dataLen;
    this.inpPtr = this.line; // Still the same array
    this.inpLen = len;
    this.dataLen += len;
    return 0;
  }

  public processSeq(input: DspSeq<dspCmpx>): number {
    return this.process(input.data, input.len);
  }

  private clearArray(arr: dspCmpx[], size: number): void {
    for (let i = 0; i < size; i++) {
      // Initialize with {re: 0, im: 0} for complex numbers
      // This assumes T is dspCmpx when used with MT63rx
      arr[i] = { re: 0, im: 0 };
    }
  }

  private copyArray(dest: dspCmpx[], src: dspCmpx[], len: number): void {
    for (let i = 0; i < len; i++) {
      dest[i] = src[i];
    }
  }

  private moveArray(dest: dspCmpx[], src: dspCmpx[], len: number): void {
    for (let i = 0; i < len; i++) {
      dest[i] = src[i];
    }
  }
}
