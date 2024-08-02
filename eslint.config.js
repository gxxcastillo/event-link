import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';
// import  from '@nx/eslint-plugin';

// import { FlatCompat } from '@eslint/eslintrc';
import { includeIgnoreFile } from '@eslint/compat';
import eslint from '@eslint/js';
import tsEslint from 'typescript-eslint';
import jsoncParser from 'jsonc-eslint-parser';
import eslintConfigPrettier from 'eslint-config-prettier';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const gitignorePath = resolve(__dirname, '.gitignore');

export default [
  includeIgnoreFile(gitignorePath),
  eslint.configs.recommended,
  ...tsEslint.configs.strict,
  {
    files: ['*.json'],
    languageOptions: {
      parser: jsoncParser,
    },
    rules: {},
  },
  eslintConfigPrettier,
];
