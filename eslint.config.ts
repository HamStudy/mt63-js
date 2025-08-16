import tseslint from 'typescript-eslint';

export default tseslint.config([
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
  tseslint.configs.strict,
  tseslint.configs.stylistic,
  {
    files: ['{src, tests}/**/*.{js,mjs,cjs,ts,mts,cts}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    rules: {
      // Additional TypeScript rules not in strict config
      '@typescript-eslint/explicit-function-return-type': 'warn',
      // Code quality rules
      complexity: ['error', 100],
      'max-depth': ['error', 4],
      'no-console': 'error',
      'no-debugger': 'error',
      curly: ['error', 'all'],
      // Quote preferences: backticks > single > double
      quotes: ['error', 'single', { avoidEscape: true }],
      'prefer-template': 'error',
      '@typescript-eslint/prefer-string-starts-ends-with': 'error',
      // Import ordering: external first, then internal alphabetically
      'sort-imports': ['error', { ignoreDeclarationSort: true }],
    },
  },
  {
    // Test file exceptions
    files: ['tests/**/*.test.{js,ts}'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.test.json',
      },
    },
    rules: {
      'no-console': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
]);
