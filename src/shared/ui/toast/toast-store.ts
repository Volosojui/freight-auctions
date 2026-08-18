import { makeAutoObservable } from 'mobx'

export type ToastKind = 'success' | 'error' | 'info'

export interface Toast {
  id: number
  kind: ToastKind
  message: string
}

const DEFAULT_TTL_MS = 4000

/**
 * Точечный MobX-стор для тостов — пример клиентского UI-state в слое shared.
 * Не хранит серверных данных; только очередь уведомлений.
 */
export class ToastStore {
  toasts: Toast[] = []
  private seq = 0

  constructor() {
    makeAutoObservable(this)
  }

  show(message: string, kind: ToastKind = 'info', ttlMs = DEFAULT_TTL_MS): number {
    const id = ++this.seq
    this.toasts.push({ id, kind, message })
    if (ttlMs > 0) {
      setTimeout(() => this.dismiss(id), ttlMs)
    }
    return id
  }

  success(message: string): number {
    return this.show(message, 'success')
  }

  error(message: string): number {
    return this.show(message, 'error')
  }

  dismiss(id: number): void {
    this.toasts = this.toasts.filter((t) => t.id !== id)
  }

  clear(): void {
    this.toasts = []
  }
}

/** Единственный на приложение стор тостов. */
export const toastStore = new ToastStore()

/** Хук доступа к тостам из любого компонента. */
export function useToast(): ToastStore {
  return toastStore
}
