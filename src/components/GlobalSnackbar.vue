<template>
  <v-snackbar
    v-model="messageState.show"
    location="top"
    :timeout="messageState.timeout"
    color="surface"
    elevation="4"
    rounded="xl"
    class="mt-4"
    :min-width="320"
  >
    <div class="d-flex align-center">
      <!-- Status Icon with Tonal Background -->
      <v-avatar
        :color="messageState.color"
        variant="tonal"
        size="36"
        class="mr-3"
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
        icon="mdi-close"
        variant="text"
        density="comfortable"
        size="small"
        color="medium-emphasis"
        class="ml-2"
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
