<template>
  <v-layout class="bg-background h-screen overflow-hidden">
    <!-- Floating Sidebar -->
    <v-navigation-drawer
      v-model="drawer"
      class="sidebar-container my-4 ms-4 rounded-xl border-0 transition-all"
      :class="rail ? 'px-1' : ''"
      color="white"
      elevation="0"
      floating
      :mobile-breakpoint="0"
      :rail="rail"
      rail-width="80"
      width="260"
    >
      <!-- Logo Area -->
      <div
        class="d-flex align-center overflow-hidden transition-all"
        :class="rail ? 'justify-center py-6 px-0' : 'justify-start pa-6'"
        style="height: 88px"
      >
        <v-img
          alt="Logo"
          class="transition-all flex-shrink-0"
          :class="rail ? '' : 'me-3'"
          contain
          height="40"
          src="@/assets/logo.svg"
          width="40"
        ></v-img>

        <div
          class="transition-all overflow-hidden"
          :style="{
            opacity: rail ? 0 : 1,
            width: rail ? '0px' : 'auto',
            transform: rail ? 'translateX(-10px)' : 'translateX(0)',
          }"
        >
          <div class="text-h6 font-weight-bold text-primary text-no-wrap">
            MUMU
          </div>
          <div
            class="text-caption text-secondary font-weight-bold text-no-wrap"
          >
            {{ $t('common.adminPanel') }}
          </div>
        </div>
      </div>

      <div
        class="mb-2 d-flex flex-column flex-grow-1 transition-all"
        :class="rail ? 'px-2' : 'px-3'"
      >
        <div
          class="text-overline text-grey-lighten-1 font-weight-bold mb-2 ps-3 transition-all overflow-hidden"
          :style="{
            height: rail ? '0px' : '20px',
            opacity: rail ? 0 : 1,
            marginBottom: rail ? '0 !important' : '8px',
          }"
        >
          {{ $t('common.menu') }}
        </div>

        <v-list class="pa-0" density="comfortable" nav>
          <v-list-item
            v-for="(item, i) in MENU_ITEMS"
            :key="i"
            active-class="bg-primary text-white"
            class="mb-2 transition-swing rounded-lg text-grey-darken-2"
            :class="rail ? 'px-2' : ''"
            :to="item.to"
            :value="item"
          >
            <div
              class="d-flex align-center"
              :class="rail ? 'justify-center w-100' : ''"
            >
              <v-icon
                :color="isActive(item) ? 'white' : 'grey-darken-1'"
                size="24"
              >
                {{ item.icon }}
              </v-icon>

              <span v-if="!rail" class="font-weight-medium ms-3 text-truncate">
                {{ $t(item.title) }}
              </span>
            </div>

            <v-tooltip
              v-if="rail"
              activator="parent"
              location="end"
              offset="10"
            >
              {{ $t(item.title) }}
            </v-tooltip>
          </v-list-item>
        </v-list>
      </div>

      <!-- Bottom Actions (User) -->
      <template #append>
        <div class="pa-4 transition-all">
          <v-menu location="end top" offset="10" transition="scale-transition">
            <template #activator="{ props }">
              <v-card
                v-ripple
                v-bind="props"
                :class="[
                  'bg-primary-lighten-5 flat transition-all overflow-hidden cursor-pointer hover-scale',
                  rail ? 'px-0 py-3 d-flex flex-column align-center' : 'pa-4',
                ]"
                flat
                rounded="xl"
              >
                <div
                  :class="[
                    'd-flex align-center transition-all',
                    rail ? 'justify-center' : '',
                  ]"
                >
                  <v-avatar
                    :class="[
                      'border-2 border-white transition-all',
                      rail ? '' : 'me-3',
                    ]"
                    color="primary"
                    size="40"
                  >
                    <v-img v-if="userAvatar" :src="userAvatar"></v-img>
                    <span v-else class="text-h6 font-weight-bold text-white">{{
                      (user?.nickName || user?.username || 'A')
                        .charAt(0)
                        .toUpperCase()
                    }}</span>
                  </v-avatar>

                  <div
                    class="overflow-hidden transition-all"
                    :style="{
                      opacity: rail ? 0 : 1,
                      width: rail ? '0px' : 'auto',
                      height: rail ? '0px' : 'auto',
                    }"
                  >
                    <div class="text-subtitle-2 font-weight-bold text-truncate">
                      {{ user?.nickName || user?.username || 'Admin' }}
                    </div>
                    <div class="text-caption text-secondary text-truncate">
                      {{ user?.email || 'user@example.com' }}
                    </div>
                  </div>

                  <v-icon v-if="!rail" class="ms-auto" color="grey" size="20"
                    >mdi-chevron-right</v-icon
                  >
                </div>
              </v-card>
            </template>

            <!-- User Menu -->
            <v-card elevation="4" min-width="200" rounded="xl">
              <v-list density="compact" nav>
                <v-list-item
                  prepend-icon="mdi-account-cog-outline"
                  rounded="lg"
                  to="/profile"
                  value="accountSettings"
                >
                  <v-list-item-title>{{
                    $t('user.personalSettings')
                  }}</v-list-item-title>
                </v-list-item>
                <v-list-item
                  prepend-icon="mdi-cog-outline"
                  rounded="lg"
                  value="systemSettings"
                >
                  <v-list-item-title>{{
                    $t('user.systemSettings')
                  }}</v-list-item-title>
                </v-list-item>
                <v-divider class="my-2"></v-divider>
                <v-list-item
                  class="text-error"
                  prepend-icon="mdi-logout"
                  rounded="lg"
                  value="logout"
                  @click="handleLogout"
                >
                  <v-list-item-title>{{ $t('user.logout') }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-card>
          </v-menu>
        </div>
      </template>
    </v-navigation-drawer>

    <!-- Main Content Wrapper -->
    <v-main class="d-flex flex-column h-screen overflow-hidden">
      <!-- Top Bar -->
      <header
        class="px-8 pt-6 pb-2 d-flex align-center justify-space-between flex-shrink-0"
      >
        <div class="d-flex align-center">
          <v-btn
            class="me-4"
            color="grey-darken-1"
            :icon="rail ? 'mdi-menu-open' : 'mdi-menu'"
            variant="text"
            @click="rail = !rail"
          ></v-btn>

          <!-- Dynamic Page Title -->
          <div>
            <h2 class="text-h5 font-weight-bold text-grey-darken-3">
              {{ pageTitle }}
            </h2>
          </div>
        </div>

        <!-- Right Actions -->
        <div class="d-flex align-center gap-3">
          <!-- Search -->
          <div class="d-none d-sm-block" style="width: 240px">
            <v-autocomplete
              v-model="search"
              bg-color="white"
              clearable
              density="compact"
              flat
              hide-details
              hide-no-data
              item-title="title"
              item-value="to"
              :items="menuSearchResults"
              menu-icon=""
              :menu-props="{
                contentClass: 'rounded-xl elevation-10 mt-2',
                offset: 5,
              }"
              :placeholder="$t('common.search')"
              prepend-inner-icon="mdi-magnify"
              rounded="pill"
              variant="solo"
              @update:model-value="handleSearchSelect"
            >
              <template #item="{ props, item }">
                <v-list-item
                  v-bind="props"
                  class="ma-2 rounded-lg"
                  :prepend-icon="item.raw.icon"
                  :title="undefined"
                >
                  <v-list-item-title class="font-weight-semibold text-body-2">
                    {{ item.raw.title }}
                  </v-list-item-title>
                </v-list-item>
              </template>
            </v-autocomplete>
          </div>

          <v-btn
            class="bg-white text-grey-darken-1"
            elevation="0"
            icon
            rounded="lg"
            size="small"
          >
            <v-badge color="error" content="3" dot>
              <v-icon>mdi-bell-outline</v-icon>
            </v-badge>
          </v-btn>
        </div>
      </header>

      <!-- Scrollable Content Area -->
      <div class="flex-grow-1 overflow-y-auto pa-0 scroll-smooth">
        <router-view />

        <!-- Footer inside content flow -->
        <v-footer
          :app="false"
          class="bg-transparent text-center d-flex justify-center py-6 text-caption text-grey"
        >
          2024 © MUMU Admin. All rights reserved.
        </v-footer>
      </div>
    </v-main>
  </v-layout>
</template>

<script lang="ts" setup>
import MD5 from 'crypto-js/md5';
import { computed, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { useDisplay } from 'vuetify';
import { getCurrentUser, logout, type UserResponse } from '@/api/auth';
import { MENU_ITEMS } from '@/config/menu';
import { message } from '@/utils/message';

const { mobile } = useDisplay();
const drawer = ref(true);
const rail = ref(false);
const router = useRouter();
const route = useRoute();
const { t } = useI18n();
const user = ref<UserResponse | null>(null);

// Automatically adjust sidebar based on screen size
watch(
  mobile,
  (val) => {
    rail.value = val; // Mobile -> Rail Mode; Desktop -> Full Mode
    drawer.value = true; // Always show sidebar
  },
  { immediate: true },
);

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

const pageTitle = computed(() => {
  // Try to find the matching menu item first
  const activeItem = MENU_ITEMS.find(
    (item) => route.path === item.to || route.path.startsWith(item.to + '/'),
  );

  if (activeItem) {
    return t(activeItem.title);
  }

  // Fallback to route name or default
  return t('menu.dashboard');
});

// Search functionality
const search = ref(null);

const menuSearchResults = computed(() => {
  return MENU_ITEMS.map((item) => ({
    ...item,
    title: t(item.title),
  }));
});

function handleSearchSelect(to: any) {
  if (to) {
    router.push(to);
    search.value = null;
  }
}

function isActive(item: any) {
  return route.path === item.to || route.path.startsWith(item.to + '/');
}

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
.sidebar-container {
  height: calc(100vh - 32px) !important;
  box-shadow: 0 10px 30px 0 rgba(0, 0, 0, 0.03);
}

.transition-all {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.gap-3 {
  gap: 12px;
}

.scroll-smooth {
  scroll-behavior: smooth;
}

.cursor-pointer {
  cursor: pointer;
}

.hover-scale:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.2);
}
</style>
