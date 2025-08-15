import { describe, expect, it } from 'vitest';
import { initRx, processAudio } from '../src/index';
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
    initRx(2000, true, 16, 5.0);

    const { audio, text: expectedText, sampleRate } = testData;

    // Use a reasonable chunk size for processing
    const chunkSize = 9216; // 24×128×3 - good balance of efficiency and reliability
    let decodedText = '';

    // Process audio in chunks
    for (let i = 0; i < audio.length; i += chunkSize) {
      const chunk = audio.slice(i, i + chunkSize);
      const chunkArray = new Float32Array(chunk);

      const result = processAudio(chunkArray, sampleRate, chunkArray.length);
      if (result && result.length > 0) {
        decodedText += result;
      }
    }

    // Verify successful decode
    expect(decodedText.length).toBeGreaterThan(0);
    expect(decodedText).toBe(expectedText);
  }, 5000);

  it('should handle empty audio input gracefully', () => {
    initRx(2000, true, 16, 5.0);

    const emptyAudio = new Float32Array(0);
    const result = processAudio(emptyAudio, 48000, 0);

    expect(result).toBe('');
  });

  it('should handle small audio chunks without errors', () => {
    initRx(2000, true, 16, 5.0);

    const smallChunk = new Float32Array(1024);
    smallChunk.fill(0); // Silent audio

    expect(() => {
      processAudio(smallChunk, 48000, smallChunk.length);
    }).not.toThrow();
  });
});
