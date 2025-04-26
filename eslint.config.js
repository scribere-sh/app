import { includeIgnoreFile } from "@eslint/compat";
import js from "@eslint/js";
import drizzle from "eslint-plugin-drizzle";
import svelte from "eslint-plugin-svelte";
import tsdoc from "eslint-plugin-tsdoc";
import globals from "globals";
import { fileURLToPath } from "node:url";
import ts from "typescript-eslint";
import svelteConfig from "./svelte.config.js";

const gitignorePath = fileURLToPath(new URL("./.gitignore", import.meta.url));

export default ts.config(
    includeIgnoreFile(gitignorePath),
    js.configs.recommended,
    ...ts.configs.recommended,
    ...svelte.configs.recommended,
    prettier,
    ...svelte.configs.prettier,
    {
        files: ["**/*.{ts,tsx}"],
        plugins: {
            tsdoc,
            drizzle,
        },
        rules: {
            "tsdoc/syntax": "warn",
            "drizzle/enforce-delete-with-where": [
                "error",
                {
                    drizzleObjectName: ["db", "tx_db"],
                },
            ],
            "drizzle/enforce-update-with-where": [
                "error",
                {
                    drizzleObjectName: ["db", "tx_db"],
                },
            ],
        },
    },
    {
        languageOptions: {
            globals: { ...globals.browser, ...globals.node },
        },
        rules: { "no-undef": "off" },
    },
    {
        files: ["**/*.svelte", "**/*.svelte.ts", "**/*.svelte.js"],
        languageOptions: {
            parserOptions: {
                projectService: true,
                extraFileExtensions: [".svelte"],
                parser: ts.parser,
                svelteConfig,
            },
        },
        rules: {
            "svelte/shorthand-attribute": "off",
            "svelte/shorthand-directive": "off",
        },
    },
);
