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
      bgColor: 'surface',
    },
    VTextarea: {
      variant: 'solo-filled',
      rounded: 'lg',
      hideDetails: 'auto',
      bgColor: 'surface',
    },
    VSelect: {
      variant: 'solo-filled',
      density: 'comfortable',
      rounded: 'lg',
      hideDetails: 'auto',
      bgColor: 'surface',
      itemColor: 'primary',
      menuProps: { contentClass: 'rounded-lg elevation-4 mt-2' },
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
          background: '#F4F5FA',
          surface: '#FFFFFF',
          'on-background': '#2F2B3D',
          'on-surface': '#2F2B3D',
          primary: '#7367F0',
          secondary: '#A8AAAE',
          error: '#EA5455',
          info: '#00CFE8',
          success: '#28C76F',
          warning: '#FF9F43',
          'grey-lighten-5': '#F4F5FA',
          'content-primary': '#2F2B3D',
          'content-secondary': '#5D596C',
          'text-disabled': '#A5A3AE',
        },
      },
      bentoDark: {
        dark: true,
        colors: {
          background: '#28243D',
          surface: '#312D4B',
          'on-background': '#E1DEF5',
          'on-surface': '#E1DEF5',
          primary: '#7367F0',
          secondary: '#A8AAAE',
          error: '#EA5455',
          info: '#00CFE8',
          success: '#28C76F',
          warning: '#FF9F43',
          'grey-lighten-5': '#28243D',
          'content-primary': '#E1DEF5',
          'content-secondary': '#B6B4C4',
          'text-disabled': '#79788A',
        },
      },
    },
  },
});
