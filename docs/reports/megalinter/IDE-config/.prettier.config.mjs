/**
 * Prettier configuration file.
 *
 * @type { import('prettier').Config }
 * @see https://prettier.io/docs/en/configuration.html
 */
const config = {
    semi: true,
    singleQuote: false,
    jsxSingleQuote: false,
    trailingComma: "all",
    bracketSpacing: true,
    objectWrap: "preserve",
    bracketSameLine: false,
    rangeStart: 0,
    rangeEnd: Number.POSITIVE_INFINITY,
    requirePragma: false,
    insertPragma: false,
    proseWrap: "preserve",
    arrowParens: "always",
    plugins: ["prettier-plugin-sh", "prettier-plugin-pkg"],
    htmlWhitespaceSensitivity: "css",
    endOfLine: "lf",
    quoteProps: "as-needed",
    vueIndentScriptAndStyle: false,
    embeddedLanguageFormatting: "auto",
    singleAttributePerLine: false,
    experimentalOperatorPosition: "end",
    experimentalTernaries: true,
    overrides: [
        {
            files: ["*.json", "*.json5"],
            options: {
                parser: "json",
                tabWidth: 4,
                useTabs: false,
                printWidth: 80,
                trailingComma: "none",
                bracketSpacing: true,
                singleQuote: false,
            },
        },
        {
            files: ["*.md", "*.markdown"],
            options: {
                parser: "markdown",
                proseWrap: "preserve",
                tabWidth: 2,
                useTabs: false,
            },
        },
    ],
};

export default config;
