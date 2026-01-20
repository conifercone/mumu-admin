<template>
  <v-layout class="rounded rounded-md">
    <!-- Navigation Drawer -->
    <v-navigation-drawer
      v-model="drawer"
      elevation="2"
      expand-on-hover
      rail
    >
      <v-list>
        <v-list-item
          prepend-avatar="@/assets/logo.svg"
          subtitle="v1.0.0"
          title="MUMU ADMIN"
        ></v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-list density="compact" nav>
        <v-list-item
          v-for="(item, i) in MENU_ITEMS"
          :key="i"
          color="primary"
          :prepend-icon="item.icon"
          :to="item.to"
          :value="item"
        >
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- App Bar -->
    <v-app-bar elevation="1">
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-app-bar-title>Dashboard</v-app-bar-title>
      <v-spacer></v-spacer>
      <v-btn icon="mdi-magnify"></v-btn>
      <v-btn icon="mdi-bell-outline"></v-btn>
      <v-avatar class="mx-2" color="primary" size="32">
        <span>A</span>
      </v-avatar>
    </v-app-bar>

    <!-- Main Content -->
    <v-main class="bg-grey-lighten-4">
      <div class="pa-6" style="min-height: 100%">
        <router-view />
      </div>
    </v-main>

    <!-- Footer -->
    <v-footer app border>
      <div class="text-center w-100">
        {{ new Date().getFullYear() }} — <strong>Mumu Admin</strong>
      </div>
    </v-footer>
  </v-layout>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { MENU_ITEMS } from '@/config/menu';

const drawer = ref(true);
</script>

<style scoped>
.bg-grey-lighten-4 {
  background-color: #f5f5f5 !important;
}
</style>
