/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Composables
import { createApp } from 'vue';

// i18n
import { useI18n } from 'vue-i18n';
import { createVuetify } from 'vuetify';

import { createVueI18nAdapter } from 'vuetify/locale/adapters/vue-i18n';

// Plugins
import { registerPlugins } from '@/plugins';
import i18n from '@/plugins/i18n';
// Components
import App from './App.vue';

import router from './router';

// Styles
import 'unfonts.css';

const vuetify = createVuetify({
  locale: {
    adapter: createVueI18nAdapter({ i18n, useI18n }),
  },
});
const app = createApp(App);
app.use(i18n);
app.use(vuetify);

registerPlugins(app);

router.isReady().then(() => {
  app.mount('#app');
});
