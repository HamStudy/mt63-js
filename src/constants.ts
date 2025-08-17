export const SAMPLE_RATE = 8000;

// MT63 mode definitions with proper center frequencies
export const MT63_MODES = {
  500: { bandwidth: 500, centerFrequency: 750 },
  1000: { bandwidth: 1000, centerFrequency: 1000 },
  2000: { bandwidth: 2000, centerFrequency: 1500 },
} as const;

export type MT63Bandwidth =
  (typeof MT63_MODES)[keyof typeof MT63_MODES]['bandwidth'];
