import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';
import jsoncParser from 'jsonc-eslint-parser';
import { includeIgnoreFile } from '@eslint/compat';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const gitignorePath = resolve(__dirname, '.gitignore');

// 👇 load plugins at the top level using `await`
const importPlugin = await import('eslint-plugin-import');

export default [
  includeIgnoreFile(gitignorePath),
  eslint.configs.recommended,
  ...tseslint.configs.strict,
  {
    files: ['**/*.json'],
    languageOptions: {
      parser: jsoncParser,
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: {
      import: importPlugin,
    },
    rules: {
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          disallowTypeAnnotations: false,
        },
      ],
      'import/consistent-type-specifier-style': ['error', 'prefer-inline'],
    },
  },
  eslintConfigPrettier,
];
