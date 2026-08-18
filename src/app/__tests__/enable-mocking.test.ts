import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

// The app is mock-only, so MSW must run in every environment. Guard against a
// regression that re-gates the worker on the dev flag (which broke the deploy).
const mainSrc = readFileSync(resolve(process.cwd(), 'src/main.tsx'), 'utf8')

describe('MSW bootstrap (main.tsx)', () => {
  it('starts the mock worker before render', () => {
    expect(mainSrc).toContain('worker.start')
    expect(mainSrc).toContain('enableMocking().then(mount)')
  })

  it('does not gate mocking on import.meta.env.DEV', () => {
    expect(mainSrc).not.toContain('import.meta.env.DEV')
  })
})
