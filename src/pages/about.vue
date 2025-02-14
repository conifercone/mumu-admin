<script setup lang="ts">
import type { CurrentLoginAccount } from '@/apis/account'
import { queryCurrentLoginAccount } from '@/apis/account'
import { onMounted, ref } from 'vue'

const currentLoginAccount = ref<CurrentLoginAccount | null>(null) // 存储接口返回的数据

onMounted(async () => {
  await fetchCurrentLoginAccount()
})

async function fetchCurrentLoginAccount() {
  currentLoginAccount.value = await queryCurrentLoginAccount()
}
</script>

<template>
  <v-container
    class="d-flex justify-center align-center fill-height"
    fluid
  >
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <!-- Account card -->
        <v-card elevation="4" class="pa-5">
          <!-- Avatar and User Info -->
          <v-row align="center" justify="center">
            <v-col cols="auto">
              <v-avatar size="100">
                <v-img :src="currentLoginAccount?.avatarUrl" />
              </v-avatar>
            </v-col>
            <v-col>
              <div class="text-h5">
                {{ currentLoginAccount?.nickName }}
              </div>
              <div class="text-subtitle-2 text--secondary">
                {{ currentLoginAccount?.email }}
              </div>
            </v-col>
          </v-row>

          <!-- About Section -->
          <v-divider class="my-4" />

          <div class="text-h6">
            About Me
          </div>
          <v-row>
            <v-col>
              <p>
                {{ currentLoginAccount?.bio }}
              </p>
            </v-col>
          </v-row>

          <!-- Social Media Links -->
          <v-divider class="my-4" />

          <v-row align="center" justify="center">
            <v-col cols="auto">
              <v-btn density="default" variant="plain" icon="mdi-facebook" />
            </v-col>
            <v-col cols="auto">
              <v-btn density="default" variant="plain" icon="mdi-twitter" />
            </v-col>
            <v-col cols="auto">
              <v-btn density="default" variant="plain" icon="mdi-linkedin" />
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>

</style>
