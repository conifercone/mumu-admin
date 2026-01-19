import prettier from 'eslint-config-prettier';
import vuetify from 'eslint-config-vuetify';

export default vuetify(
  {
    ignores: ['node_modules/**', 'dist/**', 'build/**'],
  },
  // 关闭所有与 Prettier 冲突的 ESLint 格式类规则
  prettier,
);
