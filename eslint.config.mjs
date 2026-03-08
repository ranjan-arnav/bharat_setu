import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

const eslintConfig = [
  ...compat.extends('next/core-web-vitals'),
  {
    rules: {
      // Allow inline styles in React components — required for dynamic styling
      // (e.g. style={{ color: card.color }} cannot be in a CSS file)
      'react/forbid-component-props': 'off',
      // No other rules to add — this project uses Tailwind exclusively
    },
  },
];

export default eslintConfig;
