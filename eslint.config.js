import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import boundaries from 'eslint-plugin-boundaries'
import checkFile from 'eslint-plugin-check-file'

// Feature-Sliced Design layers, ordered from top (app) to bottom (shared).
// Imports may only go "down" the list; slices in the same layer must go
// through each other's public index (enforced by boundaries/element-types).
const FSD_LAYERS = ['app', 'pages', 'widgets', 'features', 'entities', 'shared']

const allowedDependencies = FSD_LAYERS.map((layer, index) => ({
  from: layer,
  allow: FSD_LAYERS.slice(index), // self + everything below
}))

export default tseslint.config(
  { ignores: ['dist', 'public/mockServiceWorker.js', 'coverage', '.claude'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      boundaries,
      'check-file': checkFile,
    },
    settings: {
      'boundaries/elements': FSD_LAYERS.map((layer) => ({
        type: layer,
        pattern: `src/${layer}/**`,
      })),
      'boundaries/ignore': ['src/main.tsx', 'src/test/**', '**/*.test.{ts,tsx}'],
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      // FSD: enforce allowed direction of imports between layers.
      'boundaries/element-types': [
        'error',
        { default: 'disallow', rules: allowedDependencies },
      ],
      // Naming: React component files must use the *.component.tsx suffix.
      'check-file/filename-naming-convention': [
        'error',
        { 'src/**/*.tsx': '*.component' },
        { ignoreMiddleExtensions: false },
      ],
    },
  },
  // The app entry and test files render JSX but are not component modules —
  // exempt them from the *.component.tsx naming rule.
  {
    files: ['src/main.tsx', '**/*.test.{ts,tsx}', 'src/test/**'],
    rules: { 'check-file/filename-naming-convention': 'off' },
  },
  // Config files and Playwright e2e run in Node.
  {
    files: ['*.config.ts', 'e2e/**/*.ts'],
    languageOptions: { globals: globals.node },
  },
)
