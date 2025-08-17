# GitHub Copilot Instructions for MT63 TypeScript Library

## Project Overview

This is a TypeScript library for MT63 digital signal processing, converting an existing MT63 implementation into a publishable npm package `@hamstudy/mt63`.

## Development Approach

### Planning and Collaboration

- **Plan before implementing**: For any new feature or significant change, start by outlining the approach
- **Ask clarifying questions**: Ensure the plan aligns with project goals and user expectations
- **Iterate on the plan**: Ask follow-up questions to refine the approach before writing code
- **Confirm understanding**: Verify that the proposed solution matches what the user actually wants
- **Break down complex tasks**: Split large changes into smaller, manageable steps
- **Reference project plan**: Always check `PROJECT_SETUP.md` for current development phases and priorities

### Example Planning Process

1. "I understand you want X. My approach would be Y. Does this align with your goals?"
2. "Should I also consider Z? What about edge case W?"
3. "Before I implement this, are there any constraints or preferences I should know about?"
4. "Would you like me to start with A, or should I tackle B first?"

## Code Style and Conventions

### TypeScript Style

- Use strict TypeScript configuration
- Prefer explicit types over `any`
- Use ES modules (`import`/`export`)
- No `.js` extensions in import statements (modern tooling handles resolution)

### Code Formatting

- Backticks > single quotes > double quotes for strings
- 100 character line length limit
- Use Prettier for consistent formatting
- Follow ESLint rules (strict configuration)

### Import Ordering

1. External dependencies first
2. Internal imports alphabetically
3. Group related imports together

### Naming Conventions

- Use descriptive variable names
- Classes: PascalCase (e.g., `MT63Decoder`)
- Functions/variables: camelCase (e.g., `processAudio`)
- Constants: UPPER_SNAKE_CASE (e.g., `SAMPLE_RATE`)
- Files: camelCase for new files, preserve existing naming for now

## Architecture Guidelines

### Current Architecture

- Flat file structure in `/src/` (temporary during migration)
- Two main entry points:
  - `MT63Client.ts` - Class-based transmit (encode text to audio)
  - `MT63typescript.ts` - Function-based receive (decode audio to text)
  - The plan is to unify these into MT63Client.ts as a class-based API for both encoding and decoding.
- Mixed architecture: classes vs functions (needs unification)

### Performance Considerations

- **Use typed arrays**: Prefer `Float32Array`, `Float64Array`, `Int32Array` over regular arrays
- **Optimize memory usage**: Use `subarray()` instead of `slice()` when possible for zero-copy operations
- **Minimize allocations**: Reuse buffers, especially in audio processing loops
- **Avoid GC pressure**: Pre-allocate working buffers for real-time audio processing

### DSP-Specific Guidelines

- Audio data should use `Float32Array` or `Float64Array`
- FFT operations require power-of-2 sizes
- Use proper windowing functions (e.g., Blackman-Harris)
- Maintain sample rate consistency throughout processing chain
- Consider numerical precision in mathematical operations

## Testing Strategy

### Test Framework: Vitest

- Test files: `tests/*.test.ts`
- Prefer explicit imports over globals
- Use mathematical verification for DSP functions
- Include edge cases and error conditions

### Test Categories

1. **Unit tests**: Individual DSP functions with known mathematical properties
2. **Integration tests**: End-to-end audio processing with real test data
3. **Edge cases**: Empty inputs, invalid parameters, boundary conditions

### Test Examples

```typescript
// Mathematical verification
expect(dspWindowBlackman3(0)).toBeCloseTo(1.0, 5);

// DSP correctness
const fft = new dsp_r2FFT(8);
fft.ProcInPlace(cosineWave);
expect(Math.abs(fft_result[1].re)).toBeCloseTo(4.0, 5); // Energy at bin 1
```

## Git Workflow

### Commit Style

- Use Conventional Commits format
- Keep messages to one line when possible
- Focus on **what** for the purpose of **why** not restating what the diff shows.
- Examples:
  - GOOD:
    - `feat: add FFT mathematical verification tests`
    - `perf: optimize typed array usage in audio processing`
    - `fix: correct bit-reversal scrambling in FFT implementation`
    - `refactor: extract constants for center frequency and sample rate`
  - BAD:
    - `fix: changed < to <=`
    - refactor: extract constants for center frequency and sample rate
      - Add constants.ts with CENTER_FREQUENCY (1500) and SAMPLE_RATE (8000)
      - Replace hardcoded values in MT63Client and MT63tx with imports
      - Remove duplicate class properties in favor of shared constants

### Branch Strategy

- Main branch: `master` (not `main`)
- Feature branches for significant changes
- Commit frequently during development

## Development Priorities

### Phase 1: Infrastructure ✅

- Project setup, TypeScript, ESLint, testing framework

### Phase 2: Testing (Current)

- Comprehensive test coverage before any refactoring
- Mathematical verification of DSP functions
- Integration tests with real audio data

### Phase 3: Architecture (Future)

- Unify class/function architecture
- Directory restructuring
- Typed array migration and optimization
- Error handling improvements

### Phase 4: Library Interface

- Clean public API design
- JSDoc documentation
- Usage examples

## Common Patterns

### Audio Processing

```typescript
// Preferred: typed arrays with proper sizing
const audioBuffer = new Float32Array(chunkSize);
const result = processAudio(audioBuffer, sampleRate, audioBuffer.length);

// For windowing
const windowedSample = sample * dspWindowBlackman3(phase);

// For FFT operations
if (!dspPowerOf2(size)) {
  throw new Error(`FFT size must be power of 2, got ${size}`);
}
```

### Error Handling

```typescript
// Validate inputs early
if (sampleRate <= 0) {
  throw new Error(`Invalid sample rate: ${sampleRate}`);
}

// Use typed errors for different failure modes
if (audioData.length === 0) {
  return ''; // Handle gracefully when possible
}
```

## Files to Preserve

### Legacy Files (Keep Structure)

- All files in `/src/` - maintain existing names during testing phase
- `MT63typescript.ts` - main decode functionality
- `MT63Client.ts` - encode functionality
- DSP utility files: `FFT.ts`, `dsp.ts`, `Symbol.ts`

### Generated/Config Files

- `package.json` - npm configuration
- `tsconfig.json` - TypeScript build config
- `tsconfig.test.json` - Testing-specific TypeScript config
- `vitest.config.ts` - Test framework configuration
- `eslint.config.ts` - Linting rules

## Anti-Patterns to Avoid

❌ **Don't**:

- Use `any` type without strong justification
- Create unnecessary array copies with `slice()` when `subarray()` works
- Ignore ESLint warnings (fix them or document why they're necessary)
- Refactor architecture before comprehensive tests exist
- Use regular arrays for large numerical data
- Create new typed arrays in hot audio processing loops

✅ **Do**:

- Write tests before making changes
- Use typed arrays for performance-critical code
- Validate inputs at API boundaries
- Document mathematical assumptions and algorithms
- Reuse buffers where possible
- Follow the existing code style during migration phase

## Resources

- [MT63 Protocol Specification](http://www.w1hkj.com/FldigiHelp/mt63_page.html)
- [MT63 Wikipedia](https://en.wikipedia.org/wiki/MT63)
- [TypedArray Performance Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays)
- [Web Audio API Best Practices](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Best_practices)
