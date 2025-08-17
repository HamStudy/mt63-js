import { Downsampler } from './downsample';
import { MT63rx } from './MT63rx';

const k_SAMPLERATE = 8000;
const centerFrequency = 1500;

let resampledBuffer = new Float32Array(10);
let inputBufferSize = 10;
let downsampler: Downsampler | null = null;

let lastString = '';
let escape = 0;
let sqlVal = 8.0;

const Rx = new MT63rx();

export function initRx(
  bandwidth: number,
  interleave: boolean,
  integration: number,
  squelch: number
): void {
  Rx.Preset(centerFrequency, bandwidth, interleave, integration);
  sqlVal = squelch;
}

export function processAudio(samples: Float32Array, len: number): string {
  // Simulate float_buff struct
  const inBuff = samples.subarray(0, len);
  Rx.Process(inBuff);
  if (Rx.FEC_SNR() < sqlVal) {
    return '';
  }
  lastString = '';
  for (let i = 0; i < Rx.Output.Len; ++i) {
    let c = Rx.Output.Data[i];
    if (c < 8 && escape === 0) {
      continue;
    }
    if (c === 127) {
      escape = 1;
      continue;
    }
    if (escape) {
      c += 128;
      escape = 0;
    }
    lastString += String.fromCharCode(c);
  }
  return lastString;
}

export function processAudioResample(
  samples: Float32Array,
  sampleRate: number,
  len: number
): string {
  const ratioWeight = sampleRate / k_SAMPLERATE;
  if (ratioWeight === 1) {
    return processAudio(samples, len);
  } else if (ratioWeight < 1) {
    return 'ERROR BAD SAMPLE RATE';
  }
  if (!downsampler || downsampler.ratioWeight !== ratioWeight) {
    downsampler = new Downsampler(sampleRate, k_SAMPLERATE);
  }
  // Downsample
  const maxOutputSize = downsampler.calculateMaxOutputSize(len);
  if (inputBufferSize < maxOutputSize) {
    resampledBuffer = new Float32Array(maxOutputSize);
    inputBufferSize = maxOutputSize;
  }
  const inputBuffer = downsampler.downSample(samples, resampledBuffer);
  return processAudio(inputBuffer, inputBuffer.length);
}

export function getSampleRate(): number {
  return k_SAMPLERATE;
}
