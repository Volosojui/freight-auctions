import { observer } from 'mobx-react-lite'
import { toastStore } from './toast-store'

/** Хост тостов: рендерит очередь уведомлений из MobX-стора. */
export const ToastHost = observer(function ToastHost() {
  const { toasts, dismiss } = toastStore

  if (toasts.length === 0) return null

  return (
    <div className="toast-host" role="region" aria-label="Уведомления">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast--${toast.kind}`} role="status">
          <span className="toast__message">{toast.message}</span>
          <button
            type="button"
            className="toast__close"
            aria-label="Закрыть"
            onClick={() => dismiss(toast.id)}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  )
})
