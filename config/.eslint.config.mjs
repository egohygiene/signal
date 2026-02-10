import { defineConfig, globalIgnores } from "eslint/config";
import js from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";
import react from "eslint-plugin-react";
import globals from "globals";

export default defineConfig([
    // 🔧 Labelled global ignores
    globalIgnores(
        [
            "**/node_modules/**",
            "**/dist/**",
            "**/.cache/**",
            "**/.history/**",
            "**/.vscode/**",
            "**/coverage/**",
        ],
        "Ignore build and cache artifacts",
    ),

    js.configs.recommended,

    {
        files: ["**/*.{ts,tsx}"],
        languageOptions: {
            parser: tsparser,
            parserOptions: {
                ecmaVersion: "latest",
                sourceType: "module",
                project: "./tsconfig.eslint.json",
                ecmaFeatures: { jsx: true },
            },
            globals: {
                ...globals.browser,
                ...globals.node,
                ...globals.vitest,
            },
        },
        plugins: {
            "@typescript-eslint": tseslint,
            react,
        },
        rules: {
            ...tseslint.configs.recommended.rules,
            "@typescript-eslint/no-unused-vars": [
                "warn",
                { argsIgnorePattern: "^_" },
            ],
            "@typescript-eslint/consistent-type-imports": "warn",
            "react/react-in-jsx-scope": "off",
            "react/jsx-uses-react": "off",
            "react/jsx-boolean-value": "warn",
            "react/self-closing-comp": "warn",
        },
        settings: {
            react: {
                version: "detect",
            },
        },
    },
]);
