import { describe, expect, it } from 'vitest';
import { dspCmpx, dspPowerOf2, dspWindowBlackman3 } from '../src/dsp';

describe('DSP Utility Functions', () => {
  describe('dspWindowBlackman3', () => {
    it('should return correct Blackman-Harris window values', () => {
      // Test at key phase points
      expect(dspWindowBlackman3(0)).toBeCloseTo(1.0, 5); // Maximum at phase 0
      expect(dspWindowBlackman3(Math.PI)).toBeCloseTo(0.0, 3); // Very close to minimum at phase π
      expect(dspWindowBlackman3(2 * Math.PI)).toBeCloseTo(1.0, 5); // Back to maximum at 2π
    });

    it('should be symmetric around π', () => {
      const phase1 = 0.5;
      const phase2 = 2 * Math.PI - 0.5;
      expect(dspWindowBlackman3(phase1)).toBeCloseTo(
        dspWindowBlackman3(phase2),
        5
      );
    });

    it('should return values between 0 and 1', () => {
      // Test various phase values
      const phases = [
        0,
        Math.PI / 4,
        Math.PI / 2,
        (3 * Math.PI) / 4,
        Math.PI,
        (5 * Math.PI) / 4,
        (3 * Math.PI) / 2,
        (7 * Math.PI) / 4,
      ];

      phases.forEach(phase => {
        const value = dspWindowBlackman3(phase);
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThanOrEqual(1);
      });
    });

    it('should match Blackman-Harris coefficients mathematically', () => {
      // The function should match: a0 + a1*cos(ω) + a2*cos(2ω) + a3*cos(3ω)
      // where a0=0.35875, a1=0.48829, a2=0.14128, a3=0.01168
      const testPhase = Math.PI / 3;
      const expected =
        0.35875 +
        0.48829 * Math.cos(testPhase) +
        0.14128 * Math.cos(2 * testPhase) +
        0.01168 * Math.cos(3 * testPhase);

      expect(dspWindowBlackman3(testPhase)).toBeCloseTo(expected, 10);
    });
  });

  describe('dspCmpx', () => {
    it('should create complex number with real and imaginary parts', () => {
      const complex = new dspCmpx(3.5, -2.1);
      expect(complex.re).toBe(3.5);
      expect(complex.im).toBe(-2.1);
    });

    it('should handle zero values', () => {
      const zero = new dspCmpx(0, 0);
      expect(zero.re).toBe(0);
      expect(zero.im).toBe(0);
    });

    it('should handle negative values', () => {
      const negative = new dspCmpx(-1.5, -3.7);
      expect(negative.re).toBe(-1.5);
      expect(negative.im).toBe(-3.7);
    });
  });

  describe('dspPowerOf2', () => {
    it('should return true for powers of 2', () => {
      const powersOf2 = [1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048];
      powersOf2.forEach(power => {
        expect(dspPowerOf2(power)).toBe(true);
      });
    });

    it('should return false for non-powers of 2', () => {
      const nonPowersOf2 = [
        3, 5, 6, 7, 9, 10, 11, 12, 13, 14, 15, 17, 100, 1000,
      ];
      nonPowersOf2.forEach(number => {
        expect(dspPowerOf2(number)).toBe(false);
      });
    });

    it('should return false for zero and negative numbers', () => {
      expect(dspPowerOf2(0)).toBe(false);
      expect(dspPowerOf2(-1)).toBe(false);
      expect(dspPowerOf2(-8)).toBe(false);
    });

    it('should handle edge cases', () => {
      expect(dspPowerOf2(1)).toBe(true); // 2^0
      expect(dspPowerOf2(2)).toBe(true); // 2^1
    });

    it('should work correctly for large powers of 2', () => {
      // Test larger values that might be used in FFT
      expect(dspPowerOf2(4096)).toBe(true); // 2^12
      expect(dspPowerOf2(8192)).toBe(true); // 2^13
      expect(dspPowerOf2(16384)).toBe(true); // 2^14

      // And confirm nearby non-powers fail
      expect(dspPowerOf2(4095)).toBe(false);
      expect(dspPowerOf2(4097)).toBe(false);
    });
  });
});
