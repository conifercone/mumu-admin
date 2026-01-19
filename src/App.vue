<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
    <GlobalSnackbar />
  </v-app>
</template>

<script lang="ts" setup>
import GlobalSnackbar from '@/components/GlobalSnackbar.vue';
</script>