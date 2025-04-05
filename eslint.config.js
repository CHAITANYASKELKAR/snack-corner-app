import tseslint from 'typescript-eslint';

export default [
  // Base settings for all files
  {
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        // Define globals to fix no-undef errors
        console: 'readonly',
        process: 'readonly',
        localStorage: 'readonly',
        window: 'readonly',
        document: 'readonly',
        App: 'readonly',
        NodeJS: 'readonly'
      },
    },
    rules: {
      'no-undef': 'error',
    },
  },
  
  // TypeScript files configuration
  tseslint.configs.recommended,
  
  {
    files: ['**/*.ts'],
    rules: {
      // Handle unused variables in TypeScript
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', {
        'argsIgnorePattern': '^_',
        'varsIgnorePattern': '^_|^[A-Z]$', // Ignore vars starting with underscore or single capital letters
      }],
    },
  },
  
  // Special handling for type definition files
  {
    files: ['**/*type*.ts', '**/*types*.ts'],
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },
  
  // Generated files - reduce severity
  {
    files: ['**/.svelte-kit/**'],
    rules: {
      'no-undef': 'warn',
      'no-unused-vars': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
    },
  },
];