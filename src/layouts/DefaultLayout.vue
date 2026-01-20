<template>
  <v-layout class="rounded rounded-md">
    <!-- Navigation Drawer -->
    <v-navigation-drawer
      v-model="drawer"
      border="e"
      class="bg-surface"
      elevation="0"
      expand-on-hover
      rail
    >
      <v-list class="pa-2">
        <v-list-item
          nav
          prepend-avatar="@/assets/logo.svg"
          subtitle="v1.0.0"
          title="MUMU ADMIN"
        ></v-list-item>
      </v-list>

      <v-divider class="mb-2"></v-divider>

      <v-list class="pa-2" density="compact" nav>
        <v-list-item
          v-for="(item, i) in MENU_ITEMS"
          :key="i"
          active-class="bg-primary text-white"
          class="mb-1"
          :prepend-icon="item.icon"
          rounded="lg"
          :to="item.to"
          :value="item"
        >
          <v-list-item-title>{{ $t(item.title) }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- App Bar -->
    <v-app-bar border="b" class="px-2" color="surface" elevation="0" flat>
      <v-app-bar-nav-icon
        variant="text"
        @click="drawer = !drawer"
      ></v-app-bar-nav-icon>
      <v-app-bar-title class="text-subtitle-1 font-weight-bold ps-2">
        {{ $t('menu.dashboard') }}
      </v-app-bar-title>
      <v-spacer></v-spacer>
      <v-btn icon="mdi-magnify"></v-btn>
      <v-btn icon="mdi-bell-outline"></v-btn>

      <v-menu min-width="200px" rounded>
        <template #activator="{ props }">
          <v-btn class="mx-2" icon v-bind="props">
            <v-avatar color="primary" size="32">
              <v-img v-if="userAvatar" :src="userAvatar"></v-img>
              <span v-else>{{
                (user?.nickName || user?.username || 'A')
                  .charAt(0)
                  .toUpperCase()
              }}</span>
            </v-avatar>
          </v-btn>
        </template>
        <v-card>
          <v-list>
            <v-list-item
              :prepend-avatar="userAvatar || '/favicon.ico'"
              :subtitle="user?.email || '...'"
              :title="user?.nickName || user?.username || '...'"
            ></v-list-item>
          </v-list>
          <v-divider></v-divider>
          <v-list density="compact">
            <v-list-item prepend-icon="mdi-account-outline" value="profile">
              <v-list-item-title>{{ $t('user.profile') }}</v-list-item-title>
            </v-list-item>
            <v-list-item
              prepend-icon="mdi-cog-outline"
              to="/account-settings"
              value="settings"
            >
              <v-list-item-title>{{ $t('user.settings') }}</v-list-item-title>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item
              color="error"
              prepend-icon="mdi-logout"
              value="logout"
              @click="handleLogout"
            >
              <v-list-item-title>{{ $t('user.logout') }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card>
      </v-menu>
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
        {{ new Date().getFullYear() }} —
        <strong>{{ $t('layout.footer') }}</strong>
      </div>
    </v-footer>
  </v-layout>
</template>

<script lang="ts" setup>
import MD5 from 'crypto-js/md5';
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { getCurrentUser, logout, type UserResponse } from '@/api/auth';
import { MENU_ITEMS } from '@/config/menu';
import { message } from '@/utils/message';

const drawer = ref(true);
const router = useRouter();
const { t } = useI18n();
const user = ref<UserResponse | null>(null);

const userAvatar = computed(() => {
  if (user.value?.avatar?.url) {
    return user.value.avatar.url;
  }
  if (user.value?.email) {
    const hash = MD5(user.value.email.trim().toLowerCase()).toString();
    return `https://www.gravatar.com/avatar/${hash}?d=mp`;
  }
  return '';
});

async function fetchUserInfo() {
  try {
    const res = await getCurrentUser();
    const responseData = res as any;
    user.value = responseData.successful ? responseData.data : responseData;
  } catch (error) {
    console.error('Failed to fetch user info', error);
  }
}

onMounted(() => {
  fetchUserInfo();
});

async function handleLogout() {
  try {
    await logout();
  } catch (error) {
    console.error('Logout failed', error);
  } finally {
    localStorage.clear();
    message.success(t('user.logoutSuccess'));
    router.push('/auth/login');
  }
}
</script>

<style scoped>
.bg-grey-lighten-4 {
  background-color: #f5f5f5 !important;
}
</style>
