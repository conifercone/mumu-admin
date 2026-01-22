import { reactive } from 'vue';
import i18n from '@/plugins/i18n'; // Import i18n instance to access translations

const { t } = i18n.global;

export interface ConfirmOptions {
  title?: string;
  content: string;
  confirmText?: string;
  cancelText?: string;
  color?: string; // 'primary', 'error', 'warning', etc.
  icon?: string; // Optional icon for the header
}

interface ConfirmState {
  show: boolean;
  options: ConfirmOptions;
  resolve: ((value: boolean) => void) | null;
}

const defaultOptions: ConfirmOptions = {
  title: 'Confirm', // Will be overwritten by localized default if not provided
  content: '',
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  color: 'primary',
};

export const confirmState = reactive<ConfirmState>({
  show: false,
  options: { ...defaultOptions },
  resolve: null,
});

export const confirm = (options: ConfirmOptions | string): Promise<boolean> => {
  return new Promise((resolve) => {
    const userOptions =
      typeof options === 'string' ? { content: options } : options;

    confirmState.options = {
      title: userOptions.title || t('common.confirmTitle') || 'Confirm',
      content: userOptions.content,
      confirmText: userOptions.confirmText || t('common.confirm') || 'Confirm',
      cancelText: userOptions.cancelText || t('common.cancel') || 'Cancel',
      color: userOptions.color || 'primary',
      icon: userOptions.icon,
    };

    confirmState.resolve = resolve;
    confirmState.show = true;
  });
};

export const handleConfirm = () => {
  if (confirmState.resolve) {
    confirmState.resolve(true);
  }
  confirmState.show = false;
};

export const handleCancel = () => {
  if (confirmState.resolve) {
    confirmState.resolve(false);
  }
  confirmState.show = false;
};
