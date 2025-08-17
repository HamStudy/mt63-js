import { describe, expect, it } from 'vitest';
import { MT63rx } from '../src/index';
import testDataRaw from './mt63-captured-data-audio.json';

// Type the test data properly
interface TestData {
  sampleRate: number;
  text: string;
  audio: number[];
}

const testData = testDataRaw as TestData;

describe('MT63 Decoder Integration', () => {
  it('should decode real MT63 audio data', () => {
    // Initialize MT63 receiver with standard parameters
    const mt63rx = new MT63rx(2000, true, 16, 5.0);

    const { audio, text: expectedText, sampleRate } = testData;

    // Use a reasonable chunk size for processing
    const chunkSize = 9216; // 24×128×3 - good balance of efficiency and reliability
    let decodedText = '';

    // Process audio in chunks
    for (let i = 0; i < audio.length; i += chunkSize) {
      const chunk = audio.slice(i, i + chunkSize);
      const chunkArray = new Float32Array(chunk);

      const result = mt63rx.processAudioResample(chunkArray, sampleRate);
      if (result && result.length > 0) {
        decodedText += result;
      }
    }

    // Verify successful decode
    expect(decodedText.length).toBeGreaterThan(0);
    expect(decodedText).toBe(expectedText);
  }, 5000);

  it('should handle empty audio input gracefully', () => {
    const mt63rx = new MT63rx(2000, true, 16, 5.0);

    const emptyAudio = new Float32Array(0);
    const result = mt63rx.processAudioResample(emptyAudio, 48000);

    expect(result).toBe('');
  });

  it('should handle small audio chunks without errors', () => {
    const mt63rx = new MT63rx(2000, true, 16, 5.0);

    const smallChunk = new Float32Array(1024);
    smallChunk.fill(0); // Silent audio

    expect(() => {
      mt63rx.processAudioResample(smallChunk, 48000);
    }).not.toThrow();
  });
});
