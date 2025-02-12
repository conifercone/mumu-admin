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
  <v-card
    class="mx-auto"
    :subtitle="currentLoginAccount?.email"
    :title="currentLoginAccount?.username"
  >
    <template #prepend>
      <v-avatar size="24">
        <v-img
          :alt="currentLoginAccount?.username"
          :src="currentLoginAccount?.avatarUrl"
        />
      </v-avatar>
    </template>
  </v-card>
</template>

<style scoped>

</style>
