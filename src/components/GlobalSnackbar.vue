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
        variant="text"
        @click="messageState.show = false"
      >
        Close
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script setup lang="ts">
import { messageState } from '@/utils/message';
</script>
