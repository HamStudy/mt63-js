// MT63 TypeScript Library - Main Entry Point
import { MT63tx } from './MT63tx';
import type { MT63Bandwidth } from './constants';

export function encodeString(
  text: string,
  bandwidth: MT63Bandwidth,
  longInterleave: boolean,
  audioCtx: AudioContext
): {
  source: AudioBufferSourceNode;
  buffer: AudioBuffer;
  length: number;
  sampleRate: number;
} {
  const mt63tx = new MT63tx(bandwidth, longInterleave);
  const { samples, sampleRate } = mt63tx.encodeString(text);

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

export { MT63tx } from './MT63tx';
export { MT63rx } from './MT63rx';
export { MT63_MODES, type MT63Bandwidth } from './constants';
