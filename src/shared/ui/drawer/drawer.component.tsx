import { useEffect, useRef, type ReactNode } from 'react'
import { X } from 'lucide-react'
import './drawer.css'

interface DrawerProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
}

/** Slide-over panel (right). Scrim + focus-trap + Esc-close + return focus. */
export function Drawer({ open, onClose, title, children }: DrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const opener = document.activeElement as HTMLElement | null
    const focusable = () =>
      Array.from(
        panelRef.current?.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      ).filter((el) => !el.hasAttribute('disabled'))

    focusable()[0]?.focus()

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
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="drawer-backdrop"
      role="presentation"
      onClick={onClose}
      data-testid="drawer-backdrop"
    >
      <div
        ref={panelRef}
        className="drawer"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="drawer__head">
          <h2 className="drawer__title">{title}</h2>
          <button
            type="button"
            className="drawer__close"
            aria-label="Закрыть"
            onClick={onClose}
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>
        <div className="drawer__body">{children}</div>
      </div>
    </div>
  )
}
