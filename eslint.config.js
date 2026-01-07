import prettier from "eslint-config-prettier";
import vuetify from "eslint-config-vuetify";
import prettierPlugin from "eslint-plugin-prettier";

export default [
  ...vuetify(),
  // 关闭所有与 Prettier 冲突的 ESLint 格式类规则
  prettier,
  // 让 ESLint 把 Prettier 结果当作规则报错（可选，但你原来想要这个）
  {
    plugins: { prettier: prettierPlugin },
    rules: {
      "prettier/prettier": "error",
    },
  },
];
