<template>
  <v-app>
    <component :is="layout">
      <router-view />
    </component>
    <GlobalSnackbar />
  </v-app>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import GlobalSnackbar from '@/components/GlobalSnackbar.vue';
import BlankLayout from '@/layouts/BlankLayout.vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';

const route = useRoute();

const layout = computed(() => {
  return route.meta.layout === 'blank' ? BlankLayout : DefaultLayout;
});
</script>
