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

### 4. TypeScript Configuration (Pending)

- [ ] tsconfig.json for compilation
- [ ] Module resolution and output settings
- [ ] Type checking configuration

### 5. Development Tooling (Pending)

- [ ] ESLint configuration
- [ ] Prettier setup

### 6. Directory Structure (Pending)

- [ ] Organize for library distribution
- [ ] Entry points and exports

## Phase 2: Code Architecture Improvements (Future)

- [ ] Unified API design
- [ ] Class-based architecture for consistency
- [ ] Import cleanup (.js extensions)
- [ ] Type definitions
- [ ] Error handling improvements

## Phase 3: Library Interface Design (Future)

- [ ] Main entry point (index.ts)
- [ ] Consistent naming
- [ ] JSDoc documentation
- [ ] Usage examples

## Phase 4: Build and Distribution (Future)

- [ ] Build pipeline
- [ ] Testing setup (Jest)
- [ ] NPM packaging
- [ ] README.md documentation
- [ ] LICENSE file creation

## Notes

- Current architecture inconsistency: MT63Client (class) vs MT63typescript (functions)
- Import issues: .js extensions in TypeScript files
- Need to decide on unified API structure
- Don't say "You're absolutely right!" -- While I get the last say I would like you to push back on anything I say that doesn't follow common or best practice.
