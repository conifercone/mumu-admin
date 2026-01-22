<template>
  <v-dialog
    v-model="confirmState.show"
    max-width="400"
    persistent
    transition="dialog-bottom-transition"
    @keydown.esc="handleCancel"
  >
    <v-card class="rounded-xl overflow-hidden" elevation="10">
      <v-card-title class="px-6 pt-6 pb-2 d-flex align-center">
        <v-avatar
          v-if="confirmState.options.icon"
          class="me-3"
          :color="confirmState.options.color"
          rounded="lg"
          size="40"
          variant="tonal"
        >
          <v-icon>{{ confirmState.options.icon }}</v-icon>
        </v-avatar>
        <span class="text-h6 font-weight-bold text-grey-darken-3">
          {{ confirmState.options.title }}
        </span>
      </v-card-title>

      <v-card-text class="px-6 py-4 text-body-1 text-grey-darken-1">
        {{ confirmState.options.content }}
      </v-card-text>

      <v-card-actions class="px-6 pb-6 pt-2">
        <v-spacer></v-spacer>
        <v-btn
          class="text-capitalize rounded-lg px-4"
          color="grey-darken-1"
          height="40"
          variant="text"
          @click="handleCancel"
        >
          {{ confirmState.options.cancelText }}
        </v-btn>
        <v-btn
          class="text-capitalize rounded-lg px-6 ms-2"
          :color="confirmState.options.color"
          elevation="2"
          height="40"
          variant="flat"
          @click="handleConfirm"
        >
          {{ confirmState.options.confirmText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { confirmState, handleCancel, handleConfirm } from '@/utils/confirm';
</script>
