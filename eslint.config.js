import prettier from "eslint-config-prettier";
import vuetify from "eslint-config-vuetify";
import prettierPlugin from "eslint-plugin-prettier";

export default [
  ...vuetify(),
  // 关闭所有与 Prettier 冲突的 ESLint 格式类规则
  prettier,
];
