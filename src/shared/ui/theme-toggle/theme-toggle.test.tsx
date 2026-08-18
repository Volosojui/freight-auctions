import { render, screen, fireEvent } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ThemeToggle } from './theme-toggle.component'

beforeEach(() => {
  vi.unstubAllGlobals()
  // jsdom in this env has no localStorage; provide an in-memory one.
  const store = new Map<string, string>()
  vi.stubGlobal('localStorage', {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => void store.set(k, v),
    removeItem: (k: string) => void store.delete(k),
    clear: () => store.clear(),
  })
  document.documentElement.removeAttribute('data-theme')
})

describe('ThemeToggle', () => {
  it('toggles data-theme and persists the choice', () => {
    render(<ThemeToggle />)
    const btn = screen.getByTestId('theme-toggle')

    // jsdom has no matchMedia → default is light.
    expect(document.documentElement.getAttribute('data-theme')).toBe('light')

    fireEvent.click(btn)
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
    expect(localStorage.getItem('theme')).toBe('dark')

    fireEvent.click(btn)
    expect(document.documentElement.getAttribute('data-theme')).toBe('light')
    expect(localStorage.getItem('theme')).toBe('light')
  })

  it('defaults to the system preference when nothing is stored', () => {
    vi.stubGlobal('matchMedia', (query: string) => ({
      matches: query.includes('dark'),
      media: query,
      addEventListener() {},
      removeEventListener() {},
    }))
    render(<ThemeToggle />)
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
  })
})
