import { useEffect } from 'react'
import { Moon, Sun } from 'lucide-react'
import { initTheme, useTheme } from '@shared/lib/theme'

/** Light/dark theme switch shown in the app header. */
export function ThemeToggle() {
  const { theme, toggle } = useTheme()

  // Ensure the document reflects the active theme on first mount.
  useEffect(() => {
    initTheme()
  }, [])

  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggle}
      aria-label={isDark ? 'Включить светлую тему' : 'Включить тёмную тему'}
      aria-pressed={isDark}
      data-testid="theme-toggle"
    >
      {isDark ? (
        <Sun size={18} aria-hidden="true" />
      ) : (
        <Moon size={18} aria-hidden="true" />
      )}
    </button>
  )
}
