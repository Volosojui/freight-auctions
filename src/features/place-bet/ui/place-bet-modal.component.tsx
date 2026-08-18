import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { observer } from 'mobx-react-lite'
import { ApiRequestError } from '@shared/api'
import { Button, Spinner, toastStore } from '@shared/ui'
import { formatMoney, useAuctionDetailQuery } from '@entities/auction'
import { makeBetSchema, type BetFormValues } from '../model/bet-schema'
import { usePlaceBet } from '../model/use-place-bet'
import { createPlaceBetStore } from '../model/place-bet-store'
import './place-bet-modal.css'

interface Props {
  auctionUuid: string
  onClose: () => void
}

export const PlaceBetModal = observer(function PlaceBetModal({
  auctionUuid,
  onClose,
}: Props) {
  const { data, isPending } = useAuctionDetailQuery(auctionUuid)
  const mutation = usePlaceBet(auctionUuid)
  const [ui] = useState(createPlaceBetStore)
  const dialogRef = useRef<HTMLDivElement>(null)

  // Accessibility: close on Esc, trap Tab focus inside the dialog, and return
  // focus to the element that opened it.
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null
    const focusable = () =>
      Array.from(
        dialogRef.current?.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      ).filter((el) => !el.hasAttribute('disabled'))

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onClose()
        return
      }
      if (e.key === 'Tab') {
        const items = focusable()
        if (items.length === 0) return
        const first = items[0]
        const last = items[items.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      opener?.focus?.()
    }
  }, [onClose])

  const price = data?.trading.price
  const bounds = {
    min: price?.min ?? null,
    max: price?.max ?? null,
    step: price?.step ?? null,
  }

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<BetFormValues>({
    resolver: zodResolver(makeBetSchema(bounds)),
  })

  const canSetBet = data?.trading.can_set_bet ?? false

  const onSubmit = handleSubmit(async ({ price: value }) => {
    ui.clear()
    try {
      await mutation.mutateAsync(value)
      toastStore.success('Ставка принята')
      onClose()
    } catch (err) {
      if (err instanceof ApiRequestError && err.error.kind === 'validation') {
        const general: string[] = []
        for (const fieldError of err.error.problem.errors) {
          if (fieldError.field === 'price') {
            setError('price', { message: fieldError.message })
          } else {
            general.push(fieldError.message)
          }
        }
        ui.setServerError(general.join('; ') || 'Проверьте введённые данные.')
        toastStore.error('Ошибка валидации')
      } else if (err instanceof ApiRequestError) {
        const message =
          err.error.kind === 'unknown' ? 'Ошибка сервера' : err.error.problem.message
        ui.setServerError(message)
        toastStore.error(message)
      } else {
        toastStore.error('Не удалось отправить ставку')
      }
    }
  })

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onClick={onClose}
      data-testid="place-bet-backdrop"
    >
      <div
        ref={dialogRef}
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label="Сделать ставку"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal__head">
          <h2 className="modal__title">Сделать ставку</h2>
          <button
            type="button"
            className="modal__close"
            aria-label="Закрыть"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        {isPending ? (
          <Spinner />
        ) : !canSetBet ? (
          <p className="state__text" data-testid="place-bet-unavailable">
            Ставка по этому аукциону сейчас недоступна.
          </p>
        ) : (
          <form onSubmit={onSubmit} noValidate className="bet-form">
            <p className="bet-form__hint" data-testid="bet-hint">
              Доступная цена: {formatMoney(price?.available ?? null) ?? '—'}
              {price?.step != null && <> · Шаг: {formatMoney(price.step)}</>}
            </p>

            <label className="field">
              <span className="field__label">Ваша цена, ₽</span>
              <input
                className="field__input"
                type="number"
                step="any"
                inputMode="decimal"
                autoFocus
                data-testid="bet-price"
                {...register('price', { valueAsNumber: true })}
              />
            </label>
            {errors.price && (
              <p className="field__error" role="alert" data-testid="bet-price-error">
                {errors.price.message}
              </p>
            )}

            {ui.serverError && (
              <p className="field__error" role="alert" data-testid="bet-server-error">
                {ui.serverError}
              </p>
            )}

            <div className="bet-form__actions">
              <Button type="button" variant="secondary" onClick={onClose}>
                Отмена
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                data-testid="bet-submit"
              >
                {isSubmitting ? 'Отправка…' : 'Поставить'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
})
