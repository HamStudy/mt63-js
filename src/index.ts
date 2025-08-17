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
  return mt63Client.encodeString(text, bandwidth, longInterleave, audioCtx);
}

export { MT63rx } from './MT63rx';
export { MT63_MODES, type MT63Bandwidth } from './constants';
