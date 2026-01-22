<template>
  <v-snackbar
    v-model="messageState.show"
    :color="messageState.color"
    location="top"
    :timeout="messageState.timeout"
  >
    {{ messageState.message }}

    <template #actions>
      <v-btn
        icon="mdi-close"
        variant="text"
        @click="messageState.show = false"
      ></v-btn>
    </template>
  </v-snackbar>
</template>

<script setup lang="ts">
import { messageState } from '@/utils/message';
</script>
