<script setup lang="ts">
import type { CurrentLoginAccount } from '@/apis/account'
import type { Component } from 'vue'
import { queryCurrentLoginAccount } from '@/apis/account'
import { defineAsyncComponent, onMounted, ref } from 'vue'

// 当前登录账户信息
const currentLoginAccount = ref<CurrentLoginAccount | null>(null)

onMounted(async () => {
  await fetchCurrentLoginAccount()
})

async function fetchCurrentLoginAccount() {
  currentLoginAccount.value = await queryCurrentLoginAccount()
}

// 左侧导航菜单数据
const menuItems = [
  { title: 'Dashboard', href: 'dashboard', icon: 'mdi-view-dashboard' },
  { title: 'Messages', href: 'messages', icon: 'mdi-message' },
  { title: 'About', href: 'about', icon: 'mdi-information' },
]

// 当前选中的菜单项
const selectedItem = ref<string | null>(null)

// 点击菜单项时更新选中状态
function handleMenuClick(itemHref: string) {
  selectedItem.value = itemHref
}

// 定义组件映射的类型
interface PageMap {
  [key: string]: Component
  dashboard: Component
  messages: Component
  about: Component
}

// 动态组件映射
const contentPages: PageMap = {
  dashboard: defineAsyncComponent(() => import('@/pages/about.vue')),
  messages: defineAsyncComponent(() => import('@/pages/about.vue')),
  about: defineAsyncComponent(() => import('@/pages/about.vue')),
}
</script>

<template>
  <v-app id="inspire">
    <!-- 顶部栏 -->
    <v-app-bar flat>
      <v-container class="mx-auto d-flex align-center">
        <v-avatar class="me-4" size="32">
          <v-img :src="currentLoginAccount?.avatarUrl" />
        </v-avatar>

        <v-spacer />

        <v-responsive max-width="260">
          <v-text-field
            density="compact"
            label="Search"
            rounded="lg"
            variant="solo-filled"
            flat
            hide-details
            single-line
          />
        </v-responsive>
      </v-container>
    </v-app-bar>

    <!-- 主布局 -->
    <v-main class="bg-grey-lighten-3">
      <v-container fluid class="pa-0">
        <v-row no-gutters>
          <!-- 左侧边栏 -->
          <v-col cols="2">
            <v-navigation-drawer permanent class="elevation-1">
              <v-list nav density="compact">
                <v-list-item
                  v-for="item in menuItems"
                  :key="item.href"
                  :prepend-icon="item.icon"
                  :title="item.title"
                  :value="item.href"
                  :active="selectedItem === item.href"
                  @click="handleMenuClick(item.href)"
                />

                <v-divider class="my-2" />

                <v-list-item
                  prepend-icon="mdi-refresh"
                  title="Refresh"
                  value="refresh"
                  @click="selectedItem = null"
                />
              </v-list>
            </v-navigation-drawer>
          </v-col>

          <!-- 内容区域 -->
          <v-col>
            <v-container>
              <v-sheet
                min-height="70vh"
                rounded="lg"
                class="pa-4"
              >
                <!-- 动态加载组件 -->
                <component
                  :is="contentPages[selectedItem as keyof PageMap]"
                  v-if="contentPages[selectedItem as keyof PageMap]"
                />
                <!-- 默认内容 -->
                <div v-else>
                  <h2>Welcome</h2>
                  <p>Please select a menu item from the left to view content.</p>
                </div>
              </v-sheet>
            </v-container>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>
