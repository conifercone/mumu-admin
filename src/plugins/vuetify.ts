/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com
 */

import { useI18n } from 'vue-i18n';
// Composables
import { createVuetify } from 'vuetify';
import { createVueI18nAdapter } from 'vuetify/locale/adapters/vue-i18n';
import i18n from '@/plugins/i18n';

// Styles
import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles';

export default createVuetify({
  locale: {
    adapter: createVueI18nAdapter({ i18n, useI18n }),
  },
  defaults: {
    global: {
      ripple: false,
    },
    VCard: {
      elevation: 0,
      rounded: 'xl',
      color: 'surface',
    },
    VBtn: {
      elevation: 0,
      rounded: 'lg',
      height: 44,
      class: 'text-none letter-spacing-0',
    },
    VTextField: {
      variant: 'solo-filled',
      density: 'comfortable',
      rounded: 'lg',
      hideDetails: 'auto',
      bgColor: 'white',
    },
    VTextarea: {
      variant: 'solo-filled',
      rounded: 'lg',
      hideDetails: 'auto',
      bgColor: 'white',
    },
    VSelect: {
      variant: 'solo-filled',
      density: 'comfortable',
      rounded: 'lg',
      hideDetails: 'auto',
      bgColor: 'white',
    },
    VNavigationDrawer: {
      elevation: 0,
      color: 'transparent',
      border: 'none',
    },
    VAppBar: {
      elevation: 0,
      color: 'transparent',
    },
    VChip: {
      rounded: 'lg',
      label: true,
    },
  },
  theme: {
    defaultTheme: 'bentoLight',
    themes: {
      bentoLight: {
        dark: false,
        colors: {
          background: '#F8F9FC',
          surface: '#FFFFFF',
          primary: '#6C5DD3',
          secondary: '#A098E5',
          error: '#FF5757',
          info: '#3F8CFF',
          success: '#4ADE80',
          warning: '#FACC15',
          'grey-lighten-5': '#F8F9FC', // Align with background
          'text-primary': '#11142D',
          'text-secondary': '#808191',
        },
      },
    },
  },
});
