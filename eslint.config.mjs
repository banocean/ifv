// to use eslint locally with this configuration install the following packages:
//   npm install --save-dev @eslint/css @eslint/js @eslint/json @stylistic/eslint-plugin eslint eslint-plugin-jsdoc globals eslint-config-prettier
// and run it with `npx eslint .` in the root of this repository
// or with `npx eslint . --fix` to automatically fix some issues

import globals from "globals";
import js from "@eslint/js";
import css from "@eslint/css";
import json from "@eslint/json";
import jsdoc from "eslint-plugin-jsdoc";
import stylistic from "@stylistic/eslint-plugin";
import { defineConfig } from "eslint/config";
import prettierConfig from "eslint-config-prettier/flat";

export default defineConfig([
    {
        files: ["**/*.js"],
        plugins: {
            js,
            jsdoc,
            "@stylistic": stylistic,
        },
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.webextensions,
            },
            parserOptions: {
                ecmaFeatures: {
                    impliedStrict: true,
                },
            },
        },
        rules: {
            "no-console": "warn",
            "prefer-const": "error",
            eqeqeq: ["warn", "smart"],
            "no-duplicate-imports": "error",
            "no-self-compare": "error",
            "no-unassigned-vars": "error",
            yoda: ["warn", "never"],
            "no-var": "error",
            "no-useless-assignment": "warn",
            "no-unreachable-loop": "error",
            "jsdoc/check-syntax": "error",
            "jsdoc/check-types": "error",
            "jsdoc/valid-types": "error",
            "@stylistic/no-confusing-arrow": "warn",
            "@stylistic/no-mixed-operators": "warn",
            "@stylistic/no-tabs": "error",
            "@stylistic/quotes": ["error", "double"],
        },
        linterOptions: {
            reportUnusedInlineConfigs: "error",
        },
        ignores: ["/node_modules/"],
        extends: ["js/recommended"],
    },
    {
        files: ["**/*.json"],
        plugins: {
            json,
        },
        language: "json/json",
        rules: {
            "json/no-duplicate-keys": "error",
            "json/no-empty-keys": "error",
            "json/no-unsafe-values": "warn",
            "json/no-unnormalized-keys": "error",
        },
        ignores: ["package.json", "package-lock.json", "/node_modules/"],
    },
    {
        files: ["**/*.css"],
        plugins: {
            css,
        },
        rules: {
            "no-important": "off",
        },
        ignores: ["/node_modules/"],
        extends: ["css/recommended"],
    },
    prettierConfig,
]);
