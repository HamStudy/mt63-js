import { dspWalshInvTrans } from './dsp';
export class MT63Encoder {
  interleaveSize: number;
  interleavePipe: number[] = [];

  interleavePattern: number[] = [];
  interleavePointer = 0;

  constructor(
    private dataCarriers: number,
    /**
     * Interleave length, or interleaving depth, is a parameter that defines the
     * number of data elements (symbols, bits, or bytes) in a block or a sequence
     * that are interleaved in a specific pattern. Interleaving length determines
     * the extent to which the data is rearranged or spread out.
     *
     * A larger interleave length, or interleave depth, typically provides better
     * protection against burst errors since it spreads the data over a wider range.
     * However, a larger interleave length may also increase latency due to the
     * need to wait for a larger block of data to be received before decoding can begin.
     * Consequently, selecting an appropriate interleave length involves balancing error
     * protection and latency requirements for a specific application or system.
     */
    private interleaveLength: number,
    interleavePattern: number[],
    preFill = false
  ) {
    // if (!dspPowerOf2(this.dataCarriers)) {
    if (this.dataCarriers < 2 || this.dataCarriers % 2) {
      throw new Error('DataCarriers must be even and greater than 2');
    }

    this.interleaveSize = this.interleaveLength * dataCarriers;

    if (this.interleaveLength) {
      this.interleavePipe.length = this.interleaveSize;
      if (preFill) {
        for (let i = 0; i < this.interleaveSize; i++) {
          this.interleavePipe[i] = Math.round(Math.random());
        }
      } else {
        this.interleavePipe.fill(0);
      }
    }

    for (let p = 0, i = 0; i < this.dataCarriers; i++) {
      this.interleavePattern[i] = p * this.dataCarriers;
      p += interleavePattern[i];
      if (p >= this.interleaveLength) {
        p -= this.interleaveLength;
      }
    }
  }

  process(char: string): number[] {
    let code = char.charCodeAt(0);
    const output: number[] = new Array(this.dataCarriers);
    const walshBuff: number[] = new Array(this.dataCarriers).fill(0);

    code = code % (2 * this.dataCarriers); // only character codes less than (2 * dataCarriers) are valid

    if (code < this.dataCarriers) {
      walshBuff[code] = 1.0;
    } else {
      walshBuff[code - this.dataCarriers] = -1.0;
    }

    dspWalshInvTrans(walshBuff, this.dataCarriers);

    if (this.interleaveLength) {
      for (let i = 0; i < this.dataCarriers; i++) {
        this.interleavePipe[this.interleavePointer + i] =
          walshBuff[i] < 0.0 ? 1 : 0;
      }

      for (let i = 0; i < this.dataCarriers; i++) {
        let k = this.interleavePointer + this.interleavePattern[i];
        if (k >= this.interleaveSize) {
          k -= this.interleaveSize;
        }
        output[i] = this.interleavePipe[k + i];
      }
      this.interleavePointer += this.dataCarriers;
      if (this.interleavePointer >= this.interleaveSize) {
        this.interleavePointer -= this.interleaveSize;
      }
    } else {
      for (let i = 0; i < this.dataCarriers; i++) {
        output[i] = walshBuff[i] < 0.0 ? 1 : 0;
      }
    }
    return output;
  }
}
