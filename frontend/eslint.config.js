import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";
import { defineConfig, globalIgnores } from "eslint/config";

globalIgnores(["dist"]);

export default defineConfig({
  files: ["**/*.{js,jsx}"],

  plugins: {
    react: pluginReact,
  },

  languageOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    globals: globals.browser,
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
  },

  rules: {

    ...js.configs.recommended.rules,

    "react/react-in-jsx-scope": "off", 
    "react/jsx-no-target-blank": ["error", { enforceDynamicLinks: "always" }],
  },

  settings: {
    react: {
      version: "detect", // auto-detect React version
    },
  },
});
