export default {
  trailingComma: 'es5',
  singleQuote: true,
  singleAttributePerLine: true,
  overrides: [
    {
      files: '*.html',
      options: {
        parser: 'angular',
      },
    },
  ],
  plugins: ['prettier-plugin-packagejson', 'prettier-plugin-tailwindcss'],
  tailwindStylesheet: './src/app/styles/styles.css',
  tailwindFunctions: ['fuse'],
};
