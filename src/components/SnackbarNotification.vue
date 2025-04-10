<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import snackbarMessagesEventBus from '../snackbar-messages-event-bus' // 导入事件总线

const snackbarMessages = ref<string[]>([]) // 用于存储多个 snackbar 消息
const snackbarColors = ref<string[]>([]) // 用于存储多个 snackbar 颜色
const showSnackbars = ref<boolean[]>([]) // 用于控制多个 snackbar 显示与隐藏状态
// 最多同时显示 3 个 Snackbar
const MAX_SNACKBARS = 3

// 使用 watchEffect 监听 snackbarMessages 和 snackbarTrigger 的变化
watchEffect(() => {
  // 每次触发 showSnackbar 时更新 snackbarMessages 和 snackbarColors
  snackbarMessages.value = [...snackbarMessagesEventBus.snackbarMessages]
  snackbarColors.value = [...snackbarMessagesEventBus.snackbarColors]
  // 确保最多只显示 MAX_SNACKBARS 个 Snackbar
  if (snackbarMessages.value.length > MAX_SNACKBARS) {
    snackbarMessages.value = snackbarMessages.value.slice(snackbarMessages.value.length - MAX_SNACKBARS)
    snackbarColors.value = snackbarColors.value.slice(snackbarColors.value.length - MAX_SNACKBARS)
  }
  // 确保每次触发时 showSnackbars 也有足够的元素来显示所有 Snackbar
  showSnackbars.value = Array.from({ length: snackbarMessages.value.length }).fill(true) as boolean[]
})

// 从队列中移除已经显示完的 snackbar
function removeSnackbar(index: number) {
  snackbarMessagesEventBus.removeSnackbar(index)
  // 这里延迟更新 showSnackbars 来控制 Snackbar 隐藏
  setTimeout(() => {
    showSnackbars.value[index] = false
  }, 500) // 500ms 后隐藏
}
// 关闭 Snackbar 的方法
function closeSnackbar(index: number) {
  // 手动将 snackbar 隐藏
  showSnackbars.value[index] = false
  // 从队列中移除该 snackbar
  removeSnackbar(index)
}
// 动态计算每个 Snackbar 的样式，避免重叠
function getSnackbarStyle(index: number) {
  return {
    bottom: `${index * 70 + 20}px`, // 设置每个 Snackbar 垂直间距
    left: '50%',
    transform: 'translateX(-50%)', // 水平居中
    zIndex: 1000 + index, // 设置 z-index 确保它们按顺序显示
    transition: 'bottom 0.3s ease-in-out', // 让 Snackbar 出现和消失时有动画效果
  }
}
</script>

<template>
  <v-snackbar
    v-for="(message, index) in snackbarMessages" :key="index" v-model="showSnackbars[index]"
    :color="snackbarColors[index]" :style="getSnackbarStyle(index)" timeout="3000" multi-line
    @after-leave="removeSnackbar(index)"
  >
    {{ message }}
    <template #actions>
      <v-btn icon="mdi-close" @click="closeSnackbar(index)" />
    </template>
  </v-snackbar>
</template>
