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
  <v-avatar>
    <v-img
      :alt="currentLoginAccount?.username"
      :src="currentLoginAccount?.avatarUrl"
    />
  </v-avatar>
</template>

<style scoped>

</style>
