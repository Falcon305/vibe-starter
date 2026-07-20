import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import jsxA11y from "eslint-plugin-jsx-a11y";

const serverEnvAccess =
  "MemberExpression[object.object.name='process'][object.property.name='env'][property.name=/^(?!NODE_ENV$|NEXT_PUBLIC_)[A-Z0-9_]+$/]";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      ...jsxA11y.flatConfigs.recommended.rules,
      "jsx-a11y/label-has-associated-control": ["error", { depth: 3 }],
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "@typescript-eslint/no-explicit-any": "error",
      "react/no-danger": "error",
      "no-eval": "error",
      "no-implied-eval": "error",
      "no-restricted-syntax": [
        "error",
        {
          selector: serverEnvAccess,
          message: "Read server env through @/lib/env, never process.env directly.",
        },
      ],
    },
  },
  {
    files: ["components/ui/**", "registry/*/files/components/ui/**"],
    rules: {
      "jsx-a11y/heading-has-content": "off",
      "jsx-a11y/label-has-associated-control": "off",
    },
  },
  {
    files: ["lib/logger.ts"],
    rules: {
      "no-console": "off",
    },
  },
  {
    files: ["registry/blog-mdx/files/app/blog/**"],
    rules: {
      "react/no-danger": "off",
    },
  },
  {
    files: [
      "lib/env.ts",
      "lib/env.generated.ts",
      "scripts/**",
      "middleware.ts",
      "*.config.ts",
      "*.config.mjs",
      "registry/*/files/middleware.ts",
      "registry/*/files/*.config.ts",
      "registry/*/files/lib/supabase/middleware.ts",
      "registry/*/files/instrumentation.ts",
      "registry/*/files/instrumentation-client.ts",
      "registry/*/files/sentry.*.config.ts",
    ],
    rules: {
      "no-restricted-syntax": "off",
    },
  },
  {
    files: ["scripts/**"],
    rules: {
      "no-console": "off",
    },
  },
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);

export default eslintConfig;
