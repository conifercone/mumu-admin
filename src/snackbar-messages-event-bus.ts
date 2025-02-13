import { reactive } from 'vue'

// 创建事件总线
const snackbarMessagesEventBus = reactive({
  snackbarMessages: [] as string[], // 存储多个消息
  snackbarColors: [] as string[], // 存储每条消息的颜色
  snackbarTrigger: 0, // 用于触发 watchEffect
  showSnackbar(message: string, color: string) {
    // 每次调用 showSnackbar 时将消息和颜色添加到队列
    this.snackbarMessages.push(message)
    this.snackbarColors.push(color || 'error')

    // 每次调用 showSnackbar 都增加 trigger 的值，强制触发 watchEffect
    this.snackbarTrigger++
  },
  removeSnackbar(index: number) {
    // 消息展示完毕后，从队列中移除该条消息
    this.snackbarMessages.splice(index, 1)
    this.snackbarColors.splice(index, 1)
  },
})

export default snackbarMessagesEventBus
