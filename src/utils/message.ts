import { reactive } from 'vue';

type MessageType = 'success' | 'info' | 'warning' | 'error';

interface MessageState {
  show: boolean;
  message: string;
  color: MessageType;
  timeout: number;
}

export const messageState = reactive<MessageState>({
  show: false,
  message: '',
  color: 'info', // success, info, warning, error
  timeout: 3000,
});

export function showMessage (message: string,
  type: MessageType = 'info',
  timeout = 3000) {
  messageState.message = message;
  messageState.color = type;
  messageState.timeout = timeout;
  messageState.show = true;
}

export const message = {
  success: (msg: string, timeout?: number) => showMessage(msg, 'success', timeout),
  error: (msg: string, timeout?: number) => showMessage(msg, 'error', timeout),
  warning: (msg: string, timeout?: number) => showMessage(msg, 'warning', timeout),
  info: (msg: string, timeout?: number) => showMessage(msg, 'info', timeout),
};
