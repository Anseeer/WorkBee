import { defineConfig } from "eslint/config";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";

export default defineConfig([
  {
    files: ["**/*.{ts,tsx,js,jsx}"],

    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
      globals: {
        node: "readonly",
      },
    },

    plugins: {
      "@typescript-eslint": tsPlugin,
    },

    rules: {
      ...tsPlugin.configs.recommended.rules,

      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "no-unused-vars": "off",
    },
  },
]);
