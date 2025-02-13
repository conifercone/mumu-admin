<script setup lang="ts">
import type { CurrentLoginAccount } from '@/apis/account'
import { queryCurrentLoginAccount } from '@/apis/account'
import router from '@/router'
import { onMounted, ref } from 'vue'

const currentLoginAccount = ref<CurrentLoginAccount | null>(null) // 存储接口返回的数据

onMounted(async () => {
  await fetchCurrentLoginAccount()
})

async function fetchCurrentLoginAccount() {
  currentLoginAccount.value = await queryCurrentLoginAccount()
}
const links = [
  {
    title: 'Dashboard',
    href: 'dashboard',
  },
  {
    title: 'Messages',
    href: 'messages',
  },
  {
    title: 'About',
    href: 'about',
  },
]
</script>

<template>
  <v-app id="inspire">
    <v-app-bar flat>
      <v-container class="mx-auto d-flex align-center justify-center">
        <v-avatar
          class="me-4 "
          size="32"
        >
          <v-img :src="currentLoginAccount?.avatarUrl" />
        </v-avatar>

        <v-btn
          v-for="link in links"
          :key="link"
          :text="link.title"
          variant="text"
          @click="() => router.push(link.href)"
        />

        <v-spacer />

        <v-responsive max-width="160">
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

    <v-main class="bg-grey-lighten-3">
      <v-container>
        <v-row>
          <v-col cols="2">
            <v-sheet rounded="lg">
              <v-list rounded="lg">
                <v-list-item
                  v-for="n in 5"
                  :key="n"
                  :title="`List Item ${n}`"
                  link
                />

                <v-divider class="my-2" />

                <v-list-item
                  color="grey-lighten-4"
                  title="Refresh"
                  link
                />
              </v-list>
            </v-sheet>
          </v-col>

          <v-col>
            <v-sheet
              min-height="70vh"
              rounded="lg"
            >
              <!--  -->
            </v-sheet>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>
