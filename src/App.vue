<script lang="ts" setup>
import SnackbarNotification from './components/SnackbarNotification.vue' // 你的 Snackbar 组件
</script>

<template>
  <v-app>
    <v-main>
      <SnackbarNotification />
      <router-view />
    </v-main>
  </v-app>
</template>
