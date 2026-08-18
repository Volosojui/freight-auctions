import type { MockAuction } from './types'
import { createSeedAuctions } from './seed'

/** In-memory store моков — единственный источник состояния. */
export interface MockStore {
  auctions: MockAuction[]
  byUuid: Map<string, MockAuction>
}

function buildStore(): MockStore {
  const auctions = createSeedAuctions()
  return {
    auctions,
    byUuid: new Map(auctions.map((a) => [a.uuid, a])),
  }
}

let store = buildStore()

export function getStore(): MockStore {
  return store
}

/** Пересоздаёт store из детерминированного сида (изоляция тестов). */
export function resetStore(): void {
  store = buildStore()
}
