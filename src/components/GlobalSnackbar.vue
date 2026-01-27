<template>
  <v-snackbar
    v-model="messageState.show"
    class="mt-4"
    color="surface"
    elevation="4"
    location="top"
    :min-width="320"
    rounded="xl"
    :timeout="messageState.timeout"
  >
    <div class="d-flex align-center">
      <!-- Status Icon with Tonal Background -->
      <v-avatar
        class="mr-3"
        :color="messageState.color"
        size="36"
        variant="tonal"
      >
        <v-icon :icon="iconMap[messageState.color]" size="20"></v-icon>
      </v-avatar>

      <!-- Message Content -->
      <div class="d-flex flex-column py-1" style="max-width: 400px">
        <span class="text-body-2 font-weight-medium text-high-emphasis">
          {{ messageState.message }}
        </span>
      </div>

      <v-spacer></v-spacer>

      <!-- Close Action -->
      <v-btn
        class="ml-2"
        color="medium-emphasis"
        density="comfortable"
        icon="mdi-close"
        size="small"
        variant="text"
        @click="messageState.show = false"
      ></v-btn>
    </div>
  </v-snackbar>
</template>

<script setup lang="ts">
import { messageState } from '@/utils/message';

// Icons mapping for different message states
const iconMap: Record<string, string> = {
  success: 'mdi-check',
  info: 'mdi-information-variant',
  warning: 'mdi-alert-outline',
  error: 'mdi-alert-circle-outline',
};
</script>
