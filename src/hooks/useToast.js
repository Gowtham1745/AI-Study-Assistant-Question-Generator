import toast from 'react-hot-toast';

export function useToast() {
  return {
    success: (message, options) => toast.success(message, options),
    error: (message, options) => toast.error(message, options),
    info: (message, options) => toast(message, { icon: 'ℹ️', ...options }),
    warning: (message, options) => toast(message, { icon: '⚠️', ...options }),
    loading: (message, options) => toast.loading(message, options),
    dismiss: (id) => toast.dismiss(id),
    closeAll: () => toast.dismiss(),
    promise: (promise, messages) => toast.promise(promise, messages),
    custom: (component, options) => toast.custom(component, options),
  };
}