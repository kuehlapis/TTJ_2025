import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";
import { defineConfig, globalIgnores } from "eslint/config";

// Ignore build/output folder globally
globalIgnores(["dist", "node_modules"]);

export default defineConfig({
  files: ["**/*.{js,jsx}"],

  plugins: {
    react: pluginReact,
  },

  // Use recommended JS rules and React rules manually
  rules: {
    ...js.configs.recommended.rules, // standard JS rules

    // React-specific rules
    "react/react-in-jsx-scope": "off", // no need to import React in JSX
    "react/jsx-no-target-blank": ["error", { enforceDynamicLinks: "always" }],

    // Optional: adjust unused vars rule
    "no-unused-vars": ["warn", { varsIgnorePattern: "^[A-Z_]" }],

    // Optional: allow JSX in .js files
    "react/jsx-filename-extension": ["warn", { extensions: [".js", ".jsx"] }],
  },

  languageOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    globals: globals.browser,
    parserOptions: {
      ecmaFeatures: { jsx: true },
    },
  },

  settings: {
    react: {
      version: "detect", // automatically detect React version
    },
  },
});
