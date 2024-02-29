module.exports = {
  singleQuote: true,
  trailingComma: 'all',
  printWidth: 80,
  bracketSameLine: true,
  importOrder: [
    '<THIRD_PARTY_MODULES>',
    '^assets/(.*)$',
    '^(functions/(.*)|./(.*))$',
    '^(src/(.*)|./(.*))$',
    '^tests/(.*)$',
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  tailwindConfig: './tailwind.config.js',
  plugins: [require('prettier-plugin-tailwindcss')],
};
