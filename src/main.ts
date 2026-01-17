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
      login: 'LOGIN',
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
