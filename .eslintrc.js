module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@next/next/recommended',
    'next/core-web-vitals',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:jest/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
    project: ['./tsconfig.json', 'functions/tsconfig.json'],
  },
  plugins: [
    'react',
    'react-hooks',
    '@typescript-eslint',
    'jest',
    'no-relative-import-paths',
  ],
  rules: {
    'linebreak-style': ['off'],
    indent: 'off',
    'spaced-comment': ['error', 'always'],
    quotes: ['error', 'single', { avoidEscape: true }],
    semi: ['error', 'always'],
    '@typescript-eslint/no-var-requires': 'off',
    'react/display-name': 'off',
    'react/prefer-stateless-function': 'warn',
    'react/jsx-pascal-case': 'error',
    'react/self-closing-comp': 'error',
    'react/jsx-no-bind': 'error',
    'react/react-in-jsx-scope': 'off',
    'jest/consistent-test-it': ['error', { fn: 'test' }],
    'jest/no-alias-methods': ['error'],
    'jest/no-deprecated-functions': ['error'],
    'jest/no-commented-out-tests': ['error'],
    'jest/no-duplicate-hooks': ['error'],
    'jest/prefer-expect-resolves': ['error'],
    'jest/prefer-lowercase-title': ['error', { ignore: ['describe'] }],
    'jest/prefer-spy-on': ['error'],
    'jest/prefer-to-be': ['error'],
    'jest/prefer-to-contain': ['error'],
    'jest/prefer-to-have-length': ['error'],
    'jest/prefer-todo': ['error'],
    'jest/no-restricted-matchers': [
      'error',
      {
        toThrowErrorMatchingSnapshot:
          'Use `toThrowErrorMatchingInlineSnapshot()` instead',
        toMatchSnapshot: 'Use `toMatchInlineSnapshot()` instead',
      },
    ],
    //'no-relative-import-paths/no-relative-import-paths': ['error'],
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        ignoreRestSiblings: true,
      },
    ],
  },
  settings: {
    react: {
      version: 'detect',
    },
    jest: {
      version: 'detect',
    },
  },
};
