import { defineConfig } from "cspell";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const currentFile = fileURLToPath(import.meta.url);
const projectRoot = dirname(dirname(currentFile));

const dictionariesDir = resolve(projectRoot, ".vscode/dictionaries");
const reportsDir = resolve(projectRoot, "reports/cspell");
const cacheDir = resolve(projectRoot, ".cache/cspell");

export default defineConfig({
    $schema:
        "https://raw.githubusercontent.com/streetsidesoftware/cspell/main/cspell.schema.json",

    version: "0.2",
    name: "Signal Spell Hygiene",
    description: "Structured spell-checking configuration",
    language: "en",
    enabled: true,

    allowCompoundWords: false,
    caseSensitive: false,
    validateDirectives: true,
    loadDefaultConfiguration: true,
    noConfigSearch: true,

    globRoot: projectRoot,
    enableGlobDot: true,

    files: [
        "src/**/*.{ts,tsx,js,jsx}",
        "scripts/**/*.{ts,js,sh}",
        "tests/**/*.{ts,tsx,js,jsx}",
        "docs/**/*.{md,markdown}",
        "**/*.{md,markdown}",
        "**/*.{json,yaml,yml,toml}",
        "**/*.{html,css,scss}",
        ".github/**/*.{yml,yaml}",
    ],

    ignorePaths: [
        "**/node_modules/**",
        "**/dist/**",
        "**/build/**",
        "**/.next/**",
        "**/.vercel/**",
        "**/.turbo/**",
        "**/coverage/**",
        "**/vendor/**",
        "**/.cache/**",
        "**/reports/**",
        "**/.git/**",
        "**/*.{lock,min.js,map}",
        "**/package-lock.json",
        "**/pnpm-lock.yaml",
        "**/yarn.lock",
    ],

    userWords: [
        "cspell",
        "codespell",
        "devops",
        "CI",
        "CD",
        "OpenAI",
        "Terraform",
        "Kubernetes",
        "GitHub",
        "Docker",
    ],

    dictionaryDefinitions: [
        {
            name: "project-words",
            path: resolve(dictionariesDir, "project-words.dictionary"),
            addWords: true,
        },
        {
            name: "backend-terms",
            path: resolve(dictionariesDir, "backend-terms.dictionary"),
        },
        {
            name: "frontend-terms",
            path: resolve(dictionariesDir, "frontend-terms.dictionary"),
        },
        {
            name: "devops-cloud-terms",
            path: resolve(dictionariesDir, "devops-cloud-terms.dictionary"),
        },
        {
            name: "programming-terms",
            path: resolve(dictionariesDir, "programming-terms.dictionary"),
        },
        {
            name: "software-terms",
            path: resolve(dictionariesDir, "software-terms.dictionary"),
        },
    ],

    dictionaries: [
        "project-words",
        "backend-terms",
        "frontend-terms",
        "devops-cloud-terms",
        "programming-terms",
        "software-terms",
    ],

    reporters: [
        "default",
        [
            "@cspell/cspell-json-reporter",
            {
                outFile: `${reportsDir}/cspell-report.json`,
            },
        ],
    ],

    cache: {
        useCache: true,
        cacheLocation: cacheDir,
        cacheStrategy: "content",
    },

    failFast: false,
});
