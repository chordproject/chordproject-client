export default {
    printWidth: 120,
    semi: true,
    trailingComma: 'es5',
    tabWidth: 4,
    singleQuote: true,
    bracketSpacing: true,
    bracketSameLine: false,
    arrowParens: 'always',
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
    tailwindStylesheet: './src/styles/styles.css',
};
