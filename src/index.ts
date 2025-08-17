// MT63 TypeScript Library - Main Entry Point
import { MT63Client } from './MT63Client';
import type { MT63Bandwidth } from './constants';

const mt63Client = new MT63Client();

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
  const { samples, sampleRate } = mt63Client.encodeToSamples(
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

export { MT63rx } from './MT63rx';
export { MT63_MODES, type MT63Bandwidth } from './constants';
