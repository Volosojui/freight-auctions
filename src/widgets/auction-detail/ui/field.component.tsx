import type { ReactNode } from 'react'

interface FieldProps {
  label: string
  children: ReactNode
}

/** Labeled value row used across detail sections. */
export function Field({ label, children }: FieldProps) {
  return (
    <div className="field">
      <span className="field__label">{label}</span>
      <span className="field__value">{children ?? '—'}</span>
    </div>
  )
}
