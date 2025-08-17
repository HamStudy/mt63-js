import { MT63tx } from './MT63tx';
import { CENTER_FREQUENCY, SAMPLE_RATE } from './constants';

export class MT63Client {
  TX = new MT63tx();
  txLevel = -6.0;
  sigLimit = 0.95;
  TONE_AMP = 0.8;
  bufferSeconds = 600;

  get bufferMaxSize(): number {
    return SAMPLE_RATE * this.bufferSeconds; // 8000Hz sample rate, 600 seconds (10 minutes)
  }

  sourceBuffer?: Float32Array;
  dataSize = 0;

  ensureBufferSpace(increase: number): void {
    const sourceBufferSize = this.sourceBuffer?.length || 0;
    const sizeDiff = this.dataSize + increase - sourceBufferSize;
    if (sizeDiff > 0) {
      // This is not good! We will overflow the buffer.
      // The only thing to do is to resize that sucker!

      // We will increase the size by 125% of the difference or 50% of the max size, whichever
      // is larger; this is so that we don't resize it too often, so the minimum size increase
      // is 5 minutes but if there is more than 5 minutes of data we'll add more than that
      this.sourceBuffer = new Float32Array(
        sourceBufferSize + Math.max(sizeDiff * 1.25, this.bufferMaxSize * 0.5)
      );
    }
  }
  /**
   * The actual used size, rather than the length of the Float32Array
   * or in other words the number of bytes used.
   */
  flushToBuffer(multiplier = 1.0): void {
    this.ensureBufferSpace(this.TX.Comb.Output.length);
    let maxVal = 0.0;
    for (const x of this.TX.Comb.Output) {
      const a = Math.abs(x);
      if (a > maxVal) {
        maxVal = a;
      }
    }

    if (multiplier > this.sigLimit) {
      multiplier = this.sigLimit;
    }

    for (const x of this.TX.Comb.Output) {
      let val = ((x * 1.0) / maxVal) * multiplier;
      if (val > this.sigLimit) {
        val = this.sigLimit;
      }
      if (val < -this.sigLimit) {
        val = -this.sigLimit;
      }
      this.sourceBuffer![this.dataSize] = val; // eslint-disable-line @typescript-eslint/no-non-null-assertion
      this.dataSize++;
    }
  }

  interleaveFlush(): void {
    for (let i = 0; i < this.TX.DataInterleave; ++i) {
      this.TX.sendChar(String.fromCharCode(0));
      this.flushToBuffer();
    }
  }

  encodeToSamples(
    text: string,
    bandwidth: number,
    longInterleave: boolean
  ): {
    samples: Float32Array;
    sampleRate: number;
  } {
    if (bandwidth !== 500 && bandwidth !== 1000 && bandwidth !== 2000) {
      throw new Error('Invalid bandwidth');
    }
    this.sourceBuffer = new Float32Array();
    this.dataSize = 0;

    this.TX.preset(CENTER_FREQUENCY, bandwidth, longInterleave);
    this.sendTone(2, bandwidth);

    for (const curChar of text) {
      let charCode = curChar.charCodeAt(0);
      // MT63 can only encode characters 0-127 (128 total)
      // For short interleave (32), we have 2*32=64 valid codes
      // For long interleave (64), we have 2*64=128 valid codes
      const maxCode = 2 * this.TX.DataInterleave;
      if (charCode >= maxCode) {
        // Send escape character and modified character
        this.TX.sendChar(String.fromCharCode(127));
        this.flushToBuffer();
        charCode = charCode % maxCode;
      }
      this.TX.sendChar(String.fromCharCode(charCode));
      this.flushToBuffer();
    }
    this.interleaveFlush();

    this.TX.SendJam();
    this.flushToBuffer();

    return {
      samples: new Float32Array(this.sourceBuffer.subarray(0, this.dataSize)),
      sampleRate: SAMPLE_RATE,
    };
  }

  encodeString(
    text: string,
    bandwidth: number,
    longInterleave: boolean,
    audioCtx: AudioContext
  ): {
    source: AudioBufferSourceNode;
    buffer: AudioBuffer;
    length: number;
    sampleRate: number;
  } {
    const { samples, sampleRate } = this.encodeToSamples(
      text,
      bandwidth,
      longInterleave
    );

    const audioBuffer = audioCtx.createBuffer(1, samples.length, sampleRate);
    audioBuffer.copyToChannel(samples, 0);

    const source = audioCtx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioCtx.destination);

    return {
      source,
      buffer: audioBuffer,
      length: samples.length,
      sampleRate,
    };
  }

  sendTone(seconds: number, bandwidth: number): void {
    const numsmpls = Math.floor((SAMPLE_RATE * seconds) / 512);
    const w1 =
      (2.0 * Math.PI * (CENTER_FREQUENCY - bandwidth / 2.0)) / SAMPLE_RATE;
    const w2 =
      (2.0 * Math.PI * (CENTER_FREQUENCY + (31.0 * bandwidth) / 64.0)) /
      SAMPLE_RATE;
    let phi1 = 0.0;
    let phi2 = 0.0;
    this.ensureBufferSpace(numsmpls * 512);
    for (let i = 0; i < numsmpls; i++) {
      for (let j = 0; j < 512; j++) {
        this.sourceBuffer![this.dataSize] = // eslint-disable-line @typescript-eslint/no-non-null-assertion
          this.TONE_AMP * 0.5 * Math.cos(phi1) +
          this.TONE_AMP * 0.5 * Math.cos(phi2);
        this.dataSize++;
        phi1 += w1;
        phi2 += w2;
        if (i === 0) {
          this.sourceBuffer![this.dataSize - 1] *= // eslint-disable-line @typescript-eslint/no-non-null-assertion
            1.0 - Math.exp((-1.0 * j) / 40.0);
        }
        if (i === seconds - 1) {
          this.sourceBuffer![this.dataSize - 1] *= // eslint-disable-line @typescript-eslint/no-non-null-assertion
            1.0 - Math.exp((-1.0 * (SAMPLE_RATE - j)) / 40.0);
        }
      }
    }
    for (let i = 0; i < this.TX.DataInterleave; ++i) {
      this.TX.sendChar(String.fromCharCode(0));
    }
  }
}
