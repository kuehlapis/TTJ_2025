// ... (your existing imports)
import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";
import { defineConfig, globalIgnores } from "eslint/config";
import pluginReactRecommended from "eslint-plugin-react/configs/recommended.js"; // Import the recommended config

globalIgnores(["dist", "node_modules"]);

export default defineConfig(
  {
    files: ["**/*.{js,jsx}"],
    plugins: {
      react: pluginReact,
    },
    // Add the recommended React config here
    ...pluginReactRecommended,
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      // The no-unused-vars rule should now be correctly handled by the react plugin,
      // so you can disable the default ESLint rule or let the plugin handle it.
      "no-unused-vars": "off",
      "react/react-in-jsx-scope": "off",
      "react/jsx-no-target-blank": ["error", { enforceDynamicLinks: "always" }],
      // You can also explicitly turn on the specific rule for clarity if you want:
      // "react/jsx-uses-vars": "error",
    },
    settings: {
      react: {
        version: "detect", // auto-detect React version
      },
    },
  }
);