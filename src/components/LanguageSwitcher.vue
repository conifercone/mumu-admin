<template>
  <v-menu location="bottom end" offset="10" transition="scale-transition">
    <template #activator="{ props }">
      <v-btn
        v-bind="props"
        class="bg-surface text-secondary"
        elevation="0"
        icon
        rounded="lg"
        size="small"
      >
        <v-icon>mdi-translate</v-icon>
      </v-btn>
    </template>

    <v-list
      class="py-1"
      density="compact"
      elevation="4"
      rounded="xl"
      width="160"
    >
      <v-list-item
        v-for="lang in availableLocales"
        :key="lang.value"
        :active="locale === lang.value"
        active-class="bg-primary-lighten-5 text-primary"
        class="px-4 mb-1"
        rounded="lg"
        @click="switchLanguage(lang.value)"
      >
        <template #prepend>
          <span class="text-h6 me-3">{{ lang.icon }}</span>
        </template>
        <v-list-item-title class="text-body-2 font-weight-medium">
          {{ lang.label }}
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { locale } = useI18n();

const availableLocales = [
  { label: 'English', value: 'en', icon: '🇺🇸' },
  { label: '简体中文', value: 'zhHans', icon: '🇨🇳' },
];

function switchLanguage(lang: string) {
  locale.value = lang;
  localStorage.setItem('user-locale', lang);
}
</script>
