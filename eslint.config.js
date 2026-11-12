import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist", ".prerender", "node_modules"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
    },
  },
  // Contract 3 in AGENTS.md: a raw "/assets/..." path resolves at a domain root
  // and silently 404s on the subpath deploy. Every static asset URL has to go
  // through asset() or assetSrcSet(), which prefix BASE_URL. This is the guard
  // for that; previously it relied on review alone.
  {
    files: ["src/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector:
            "Literal[value=/^\\u002fassets\\u002f/]:not(CallExpression[callee.name=/^(asset|assetSrcSet)$/] Literal)",
          message:
            "Absolute /assets/ path. Wrap it in asset() or assetSrcSet() from src/content/assets.ts, or it will 404 on the subpath deploy.",
        },
      ],
    },
  },
  {
    files: ["scripts/**/*.mjs", "vite.config.ts"],
    languageOptions: { globals: globals.node },
  },
);
