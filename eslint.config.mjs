import globals from "globals";
import js from "@eslint/js";
import json from "@eslint/json";
import jsdoc from "eslint-plugin-jsdoc";
import stylistic from "@stylistic/eslint-plugin-js";
import { defineConfig } from "eslint/config";

export default defineConfig([
    {
        files: ["**/*.js"],
        plugins: {
            js,
            jsdoc,
            stylistic,
        },
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.webextensions
            },
            parserOptions: {
                ecmaFeatures: {
                    impliedStrict: true,
                }
            }
        },
        rules: {
            "no-console": "warn",
            "prefer-const": "error",
            "eqeqeq": ["warn", "smart"],
            "no-duplicate-imports": "error",
            "no-self-compare": "error",
            "no-unassigned-vars": "error",
            "yoda": ["warn", "never"],
            "no-var": "error",
            "no-useless-assignment": "warn",
            "no-unreachable-loop": "error",
            "jsdoc/check-syntax": "error",
            "jsdoc/check-types": "error",
            "jsdoc/valid-types": "error",
            "stylistic/brace-style": ["error", "1tbs"],
            "stylistic/comma-dangle": ["error", "always-multiline"],
            "stylistic/comma-spacing": "error",
            "stylistic/function-call-spacing": ["error", "never"],
            "stylistic/function-paren-newline": ["error", "multiline"],
            "stylistic/indent": ["error", 4, { "SwitchCase": 1 }],
            "stylistic/key-spacing": ["error", { "beforeColon": false, "afterColon": true, "mode": "minimum" }],
            "stylistic/keyword-spacing": "error",
            "stylistic/no-confusing-arrow": "warn",
            "stylistic/no-extra-semi": "error",
            "stylistic/no-mixed-operators": "warn",
            "stylistic/no-tabs": "error",
            "stylistic/quotes": ["error", "double"],
            "stylistic/semi": ["error", "always"],
            "stylistic/semi-spacing": ["error", { "before": false, "after": true }],
            "stylistic/semi-style": ["error", "last"],
            "stylistic/switch-colon-spacing": ["error", { "after": true, "before": false }],
            "stylistic/no-trailing-spaces": "error",
            "stylistic/no-whitespace-before-property": "error",
        },
        linterOptions: {
            reportUnusedInlineConfigs: "error",
        },
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
    }
]);