import { makeAutoObservable } from 'mobx'

/**
 * Точечный MobX UI-store формы ставки. Держит только эфемерное состояние,
 * которого нет ни в роутере, ни в Query: общий (не полевой) серверный текст
 * ошибки, показываемый баннером над формой. Открытие формы адресуется через
 * URL, статус сабмита — через мутацию Query; здесь их не дублируем.
 */
export class PlaceBetUiStore {
  serverError: string | null = null

  constructor() {
    makeAutoObservable(this)
  }

  setServerError(message: string): void {
    this.serverError = message
  }

  clear(): void {
    this.serverError = null
  }
}

export function createPlaceBetStore(): PlaceBetUiStore {
  return new PlaceBetUiStore()
}
