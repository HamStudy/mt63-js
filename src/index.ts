// MT63 TypeScript Library - Main Entry Point
import { MT63Client } from './MT63Client';

const mt63Client = new MT63Client();

export function encodeString(
  text: string,
  bandwidth: number,
  longInterleave: boolean,
  audioCtx: AudioContext,
) {
  return mt63Client.encodeString(text, bandwidth, longInterleave, audioCtx);
}

export {
  initRx,
  processAudioResample as processAudio,
} from './MT63typescript';
