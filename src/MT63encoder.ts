import { dspWalshInvTrans } from './dsp';
export class MT63encoderOld {
  public Output: boolean[] = [];

  private DataCarriers = 0;
  private CodeMask = 0;
  private IntlvLen = 0;
  private IntlvSize = 0;
  private IntlvPatt: number[] = [];
  private IntlvPipe: boolean[] = [];
  private IntlvPtr = 0;
  private WalshBuff: number[] = [];

  public Free(): void {
    this.Output = [];
    this.IntlvPipe = [];
    this.WalshBuff = [];
    this.IntlvPatt = [];
  }
  public preset(
    Carriers: number,
    Intlv: number,
    Pattern: number[],
    PreFill = false
  ): boolean {
    if (Carriers < 2 || Carriers % 2) {
      return false;
    }

    this.DataCarriers = Carriers;
    this.IntlvLen = Intlv;
    this.IntlvSize = this.IntlvLen * this.DataCarriers;
    if (this.IntlvLen) {
      this.IntlvPipe.length = this.IntlvSize;
      if (PreFill) {
        for (let i = 0; i < this.IntlvSize; i++) {
          this.IntlvPipe[i] = !!Math.floor(Math.random() * 2);
        }
      } else {
        this.IntlvPipe.fill(false);
      }
      this.IntlvPtr = 0;
    }
    this.WalshBuff.length = this.DataCarriers;
    this.Output.length = this.DataCarriers;
    this.CodeMask = 2 * this.DataCarriers - 1;

    for (let p = 0, i = 0; i < this.DataCarriers; i++) {
      this.IntlvPatt[i] = p * this.DataCarriers;
      p += Pattern[i];
      if (p >= this.IntlvLen) {
        p -= this.IntlvLen;
      }
    }
    return true;
  }

  public process(code: number): number {
    code &= this.CodeMask;
    for (let i = 0; i < this.DataCarriers; i++) {
      this.WalshBuff[i] = 0;
    }
    if (code < this.DataCarriers) {
      this.WalshBuff[code] = 1.0;
    } else {
      this.WalshBuff[code - this.DataCarriers] = -1.0;
    }

    dspWalshInvTrans(this.WalshBuff, this.DataCarriers);

    if (this.IntlvLen) {
      for (let i = 0; i < this.DataCarriers; i++) {
        this.IntlvPipe[this.IntlvPtr + i] = this.WalshBuff[i] < 0.0;
      }
      for (let i = 0; i < this.DataCarriers; i++) {
        let k = this.IntlvPtr + this.IntlvPatt[i];
        if (k >= this.IntlvSize) {
          k -= this.IntlvSize;
        }
        this.Output[i] = this.IntlvPipe[k + i];
      }
      this.IntlvPtr += this.DataCarriers;
      if (this.IntlvPtr >= this.IntlvSize) {
        this.IntlvPtr -= this.IntlvSize;
      }
    } else {
      for (let i = 0; i < this.DataCarriers; i++) {
        this.Output[i] = this.WalshBuff[i] < 0.0;
      }
    }

    return 0;
  }
}

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
