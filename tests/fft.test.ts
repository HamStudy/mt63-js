import { beforeEach, describe, expect, it } from 'vitest';
import { dsp_r2FFT } from '../src/FFT';
import { dspCmpx } from '../src/dsp';

describe('FFT (dsp_r2FFT)', () => {
  let fft: dsp_r2FFT;

  beforeEach(() => {
    fft = new dsp_r2FFT();
  });

  describe('constructor and initialization', () => {
    it('should create empty FFT object without size', () => {
      expect(fft.Size).toBe(0);
      expect(fft.BitRevIdx).toEqual([]);
      expect(fft.Twiddle).toEqual([]);
    });

    it('should create and preset FFT with size parameter', () => {
      const fftWithSize = new dsp_r2FFT(8);
      expect(fftWithSize.Size).toBe(8);
      expect(fftWithSize.BitRevIdx.length).toBe(8);
      expect(fftWithSize.Twiddle.length).toBe(8); // Size (not Size/2)
    });
  });

  describe('preset method', () => {
    it('should successfully preset with power of 2 sizes', () => {
      const validSizes = [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024];

      validSizes.forEach(size => {
        const result = fft.preset(size);
        expect(result).toBe(0); // Success
        expect(fft.Size).toBe(size);
        expect(fft.BitRevIdx.length).toBe(size);
        expect(fft.Twiddle.length).toBe(size); // Size (not Size/2)
      });
    });

    it('should fail with non-power-of-2 sizes', () => {
      const invalidSizes = [3, 5, 6, 7, 9, 10, 15, 17, 100];

      invalidSizes.forEach(size => {
        const result = fft.preset(size);
        expect(result).toBe(-1); // Failure
      });
    });

    it('should create correct bit-reversal indices for size 8', () => {
      fft.preset(8);
      // For size 8, bit reversal should be: [0,4,2,6,1,5,3,7]
      expect(fft.BitRevIdx).toEqual([0, 4, 2, 6, 1, 5, 3, 7]);
    });

    it('should create twiddle factors with correct length', () => {
      fft.preset(16);
      expect(fft.Twiddle.length).toBe(16); // Size (not Size/2)

      // Verify twiddle factors are complex numbers
      fft.Twiddle.forEach(twiddle => {
        expect(twiddle).toBeInstanceOf(dspCmpx);
        expect(typeof twiddle.re).toBe('number');
        expect(typeof twiddle.im).toBe('number');
      });
    });
  });

  describe('Free method', () => {
    it('should reset FFT object to initial state', () => {
      fft.preset(64);
      expect(fft.Size).toBe(64);

      fft.Free();
      expect(fft.Size).toBe(0);
      expect(fft.BitRevIdx).toEqual([]);
      expect(fft.Twiddle).toEqual([]);
    });
  });

  describe('separTwoReals method', () => {
    it('should separate two real signals from complex buffer', () => {
      fft.preset(8);

      // Create test input buffer
      const buff = Array.from({ length: 8 }, (_, i) => new dspCmpx(i, i + 0.5));
      const out0 = Array.from({ length: 4 }, () => new dspCmpx(0, 0));
      const out1 = Array.from({ length: 4 }, () => new dspCmpx(0, 0));

      fft.separTwoReals(buff, out0, out1);

      // Verify outputs are complex numbers
      out0.forEach(sample => expect(sample).toBeInstanceOf(dspCmpx));
      out1.forEach(sample => expect(sample).toBeInstanceOf(dspCmpx));

      // DC components should be real parts of input
      expect(out0[0].re).toBe(buff[0].re);
      expect(out1[0].re).toBe(buff[0].im);

      // Verify the mathematical separation is correct
      expect(out0[0].im).toBe(buff[4].re); // HalfSize index
      expect(out1[0].im).toBe(buff[4].im);
    });
  });

  describe('mathematical correctness', () => {
    it('should perform correct FFT on known input', () => {
      fft.preset(4);

      // Test with a simple known case: DC signal
      const input = [
        new dspCmpx(1, 0),
        new dspCmpx(1, 0),
        new dspCmpx(1, 0),
        new dspCmpx(1, 0),
      ];

      fft.ProcInPlace(input); // Use full FFT process including scrambling

      // After FFT of DC signal, should have energy only at DC bin (index 0)
      expect(input[0].re).toBeCloseTo(4, 5); // Sum of all inputs
      expect(input[0].im).toBeCloseTo(0, 5); // No imaginary component

      // Other bins should be zero for pure DC
      for (let i = 1; i < 4; i++) {
        expect(Math.abs(input[i].re)).toBeLessThan(1e-10);
        expect(Math.abs(input[i].im)).toBeLessThan(1e-10);
      }
    });

    it('should perform correct FFT on sinusoid', () => {
      fft.preset(8);

      // Create a sinusoid at bin 1 (fundamental frequency)
      const input = Array.from(
        { length: 8 },
        (_, i) => new dspCmpx(Math.cos((2 * Math.PI * i) / 8), 0)
      );

      fft.ProcInPlace(input); // Use full FFT process including scrambling

      // Should have energy at bins 1 and 7 (negative frequency) for a cosine
      expect(Math.abs(input[1].re)).toBeCloseTo(4, 5); // Exact value for cosine
      expect(Math.abs(input[7].re)).toBeCloseTo(4, 5); // Exact value for cosine

      // DC and other bins should be zero
      expect(Math.abs(input[0].re)).toBeLessThan(1e-10);
      for (let i = 2; i < 7; i++) {
        expect(
          Math.sqrt(input[i].re * input[i].re + input[i].im * input[i].im)
        ).toBeLessThan(1e-10);
      }
    });
  });
});
