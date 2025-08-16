# MT63 TypeScript Library Setup Plan

## Project Overview

Converting MT63 TypeScript implementation into a publishable npm library as `@hamstudy/mt63js` or `@hamstudy-mt63-js`.

## Current State

- Raw TypeScript source files in `/src/` directory
- Two main entry points:
  - `MT63Client.ts` - Class-based transmit (encode text to audio)
  - `MT63typescript.ts` - Function-based receive (decode audio to text)
- No build system, package.json, or project infrastructure

## Setup Decisions Made

- **Git branch**: `master` (not main)
- **VS Code config**: Include `.vscode/` in repository (not gitignored)
- **Commit style**: Conventional Commits format and keep messages succinct
- **Package name**: `@hamstudy/mt63`
- **Repository URL**: `git+https://github.com/HamStudy/mt63-js.git`
- **License**: `SEE LICENSE IN LICENSE` (need LICENSE file)
- **Author**: `HamStudy.org LLC`
- **Version**: `1.0.0-beta.0`
- **Module type**: ES modules (`"type": "module"`)
- **Linting**: Strict ESLint rules with TypeScript
- **Code style**: Backticks > single quotes > double quotes, 100 char line length
- **Import ordering**: External deps first, then internal alphabetically

## Phase 1: Project Infrastructure Setup

### 1. Git Repository Setup ✅ (Complete)

- [x] Initialize git repository with `master` branch
- [x] Create `.gitignore` (exclude node_modules, dist, .env, OS files, but include .vscode)
- [x] Initial commit with conventional commit message

### 2. Package.json Setup ✅ (Complete)

- [x] Project metadata and description
- [x] Dependencies and devDependencies
- [x] NPM publishing configuration

### 3. Build Scripts Setup (Pending)

- [ ] Determine build tool (tsc, rollup, rolldown, etc.)
- [ ] Development scripts
- [ ] Lint and test scripts
- [ ] Publishing workflow scripts

### 4. TypeScript Configuration ✅ (Complete)

- [x] tsconfig.json for compilation
- [x] Module resolution and output settings
- [x] Type checking configuration

### 5. Development Tooling ✅ (Complete)

- [x] ESLint configuration (strict rules configured)
- [x] Prettier setup
- [x] Fix ESLint violations (166 issues found)

### 6. Directory Structure (Deferred)

- [x] Keep current flat structure for now
- [x] Create index.ts entry point only
- [ ] Defer restructuring until after tests are written

## Phase 2: Testing Infrastructure (In Progress)

**Testing Framework Choice: Vitest** ✅ (Decided)

- **Framework**: Vitest (better ES modules + TypeScript support than Jest)
- **Config**: `vitest.config.ts` in root directory
- **Test Pattern**: `**/*.test.ts`
- **Test Location**: `tests/` directory (sibling to src/)
- **Environment**: Node.js (no browser APIs initially)
- **TypeScript**: Vitest built-in TypeScript support
- **Coverage**: Default (v8)
- **UI Package**: Skip @vitest/ui for now (optional web dashboard)

**Setup Tasks:**

- [x] Install vitest dependency
- [x] Create vitest.config.ts
- [x] Create separate tsconfig.json for tests (discuss inheritance/overrides)
- [x] Update main tsconfig.json (remove test exclusions, consider import resolution)
- [x] Remove .js extensions from imports in source files (modern best practice)
- [x] Update .gitignore for vitest coverage/cache files
- [x] Update ESLint test file rules (add vitest globals like describe, it, expect)
- [x] Add test script to package.json
- [x] Add build script to package.json (tsc for now, revisit bundler later)
- [x] Create hello world test
- [x] Write decode integration test (with provided test data)
- [x] Write unit tests for core MT63 functionality
- [ ] Add test coverage reporting

**Testing Configuration Notes:**

- **Test file naming**: `*.test.ts` in `tests/` folder
- **TypeScript config**: Separate tsconfig for tests to handle different needs
- **Import extensions**: Remove .js extensions (modern tooling handles resolution)
- **Test imports**: Explicit imports preferred over globals (no `globals: true`)
- **Build tool**: Start with `tsc`, revisit bundler need later

## Phase 3: Code Architecture Improvements (Future - After Testing)

- [ ] Unified API design
- [ ] Class-based architecture for consistency
- [ ] Directory restructuring (core/, dsp/, utils/, api/)
- [ ] Type definitions improvements
- [ ] Error handling improvements
- [ ] Audit and migrate to typed arrays for performance (Float32Array, Float64Array, Int32Array, etc.)
- [ ] Optimize typed array usage (subarray() vs slice(), buffer reuse, minimize allocations)

## Phase 4: Library Interface Design (After Testing)

- [ ] Main entry point (index.ts)
- [ ] Consistent naming conventions
- [ ] JSDoc documentation
- [ ] Usage examples and README

## Phase 5: Build and Distribution (Final)

- [ ] Build pipeline
- [ ] Testing setup (Jest)
- [ ] NPM packaging
- [ ] README.md documentation
- [ ] LICENSE file creation

## Notes

- When I say "notes" I refer to any `.md` file with instructions, not just this Notes section
- Current architecture inconsistency: MT63Client (class) vs MT63typescript (functions)
- Need to decide on unified API structure
- **Testing First**: Must write comprehensive tests before any restructuring/refactoring
- Keep current file structure until tests provide safety net for changes
- Don't say "You're absolutely right!" -- While I get the last say I would like you to push back on anything I say that doesn't follow common or best practice.
- Commit often, possibly after ever step. When in doubt ask if we should commit the changes just made. Unless there is a good reason to add more, keep commit messages to one line. Describing what is changed in the commit message isn't helpful as someone can see this by the changes themselves. Writing a message that describes the reason for the change is more helpful.
- timeout is not a command, don't try to use it
