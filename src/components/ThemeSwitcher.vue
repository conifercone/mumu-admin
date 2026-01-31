<template>
  <v-btn
    class="bg-surface text-grey-darken-1"
    color="grey-darken-1"
    elevation="0"
    :icon="isDark ? 'mdi-weather-night' : 'mdi-weather-sunny'"
    rounded="lg"
    size="small"
    variant="text"
    @click="toggleTheme"
  >
  </v-btn>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useTheme } from 'vuetify';

const theme = useTheme();
const isDark = ref(false);

onMounted(() => {
  const savedTheme = localStorage.getItem('user-theme');
  if (savedTheme) {
    theme.global.name.value = savedTheme;
    isDark.value = savedTheme === 'bentoDark';
  } else {
    // Default to light if no preference
    isDark.value = theme.global.current.value.dark;
  }
});

function toggleTheme() {
  const newTheme = theme.global.current.value.dark ? 'bentoLight' : 'bentoDark';
  theme.global.name.value = newTheme;
  isDark.value = newTheme === 'bentoDark';
  localStorage.setItem('user-theme', newTheme);
}
</script>
