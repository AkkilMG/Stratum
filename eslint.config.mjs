import next from "eslint-config-next/core-web-vitals";

const eslintConfig = [
  ...next,
  {
    ignores: [".next/**", "out/**", "node_modules/**", "next-env.d.ts"],
  },
];

export default eslintConfig;
