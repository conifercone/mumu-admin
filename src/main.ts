/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins';

// Components
import App from './App.vue';

// Composables
import { createApp } from 'vue';
import { createVuetify } from 'vuetify';

// i18n
import { createI18n, useI18n } from 'vue-i18n';
import { createVueI18nAdapter } from 'vuetify/locale/adapters/vue-i18n';
import { en, zhHans } from 'vuetify/locale';

// Styles
import 'unfonts.css';

const messages = {
  en: {
    auth: {
      login: 'Login',
      welcome: 'Welcome to Mumu Admin! 👋🏻',
      subtitle: 'Please sign-in to your account and start the adventure',
      email: 'Email',
      usernameOrEmail: 'Username or Email',
      password: 'Password',
      remember: 'Remember me',
      forgot: 'Forgot Password?',
      newAccount: 'New on our platform?',
      createAccount: 'Create an account',
      username: 'Username',
      registerTitle: 'Adventure starts here 🚀',
      registerSubtitle: 'Make your app management easy and fun!',
      agree: 'I agree to',
      privacy: 'privacy policy & terms',
      signup: 'Sign up',
      alreadyUser: 'Already have an account?',
      signIn: 'Sign in instead',
      or: 'or',
    },
    $vuetify: {
      ...en,
      dataIterator: {
        rowsPerPageText: 'Items per page:',
        pageText: '{0}-{1} of {2}',
      },
    },
  },
  zhHans: {
    auth: {
      login: '登录',
      welcome: '欢迎来到 Mumu Admin! 👋🏻',
      subtitle: '请登录您的账号开始管理',
      email: '邮箱',
      usernameOrEmail: '邮箱/用户名',
      password: '密码',
      remember: '记住我',
      forgot: '忘记密码?',
      newAccount: '新用户?',
      createAccount: '创建账号',
      username: '用户名',
      registerTitle: '冒险从这里开始 🚀',
      registerSubtitle: '让应用管理变得轻松有趣！',
      agree: '我同意',
      privacy: '隐私政策和条款',
      signup: '注册',
      alreadyUser: '已经是用户？',
      signIn: '直接登录',
      or: '或',
    },
    $vuetify: {
      ...zhHans,
      dataIterator: {
        rowsPerPageText: '每页条目数：',
        pageText: '{0}-{1} 共 {2} 条',
      },
    },
  },
};

const i18n = createI18n({
  legacy: false, // Vuetify 不支持 vue-i18n legacy 模式
  locale: 'zhHans',
  fallbackLocale: 'en',
  messages,
});

const vuetify = createVuetify({
  locale: {
    adapter: createVueI18nAdapter({ i18n, useI18n }),
  },
});
const app = createApp(App);
app.use(i18n);
app.use(vuetify);

registerPlugins(app);

app.mount('#app');
