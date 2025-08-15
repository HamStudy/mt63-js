import { describe, it, expect } from 'vitest';
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
    // Initialize MT63 receiver with test parameters
    // Parameters: bandwidth=2000, longInterleave=true, integration=16, squelch=5.0
    initRx(2000, true, 16, 5.0);

    const { audio, text: expectedText, sampleRate } = testData;

    // Chunk size experimentation - starting with your recommendation
    const chunkSize = 6 * 128 * 3; // 2304 samples

    let decodedText = '';
    let totalChunks = 0;
    let chunksWithOutput = 0;

    // Process audio in chunks
    for (let i = 0; i < audio.length; i += chunkSize) {
      const chunk = audio.slice(i, i + chunkSize);
      const chunkArray = new Float32Array(chunk);
      totalChunks++;

      const result = processAudio(chunkArray, sampleRate, chunkArray.length);

      if (result && result.length > 0) {
        decodedText += result;
        chunksWithOutput++;
      }
    }

    // Verify we got some decoded output
    expect(decodedText.length).toBeGreaterThan(0);

    // Verify exact text match - MT63 should decode perfectly with real test data
    expect(decodedText).toBe(expectedText);
  }, 30000); // 30 second timeout for long decode process
});
