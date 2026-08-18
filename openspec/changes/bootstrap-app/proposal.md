## Why

Проект — greenfield: нет ни приложения, ни тулинга. Все последующие фичи (список аукционов, детальная, ставки, форма ставки) зависят от единого каркаса: сборки, роутинга, data-layer провайдеров, замоканного API и структуры Feature-Sliced Design. Этот change закладывает фундамент-энейблер, чтобы `npm run dev` поднимал рабочий SPA-скелет, в который остальные change'и добавляют вертикальные фичи.

## What Changes

- Инициализация проекта на **Vite + React + TypeScript** (строгий режим).
- Подключение обязательного стека: **TanStack Router** (роутер + devtools), **TanStack Query** (`QueryClient` + provider + devtools), **React Hook Form + Zod**, **MobX** (для точечного клиентского UI-state), **MSW** (bootstrap worker, включён в dev-режиме).
- Каркас **Feature-Sliced Design**: слои `app / pages / widgets / features / entities / shared` с правилами импортов; договорённость об именовании файлов React-компонентов суффиксом `*.component.tsx`.
- **App shell**: корневой layout (шапка + контентная область, адаптивная под desktop/mobile), провайдеры (Query, Router), базовый UI-набор (кнопка, карточка, спиннер/skeleton-примитив, toast-контейнер).
- **Route skeleton**: маршрут списка (`/`) и детальной (`/auctions/$auctionUuid`) как заглушки; `not-found` и корневой error boundary.
- MSW включается только в dev/тестах и не попадает в production-бандл.
- Базовые тулзы качества: ESLint + Prettier + `tsconfig` с path-алиасами под FSD, скрипт запуска тестов (Vitest).

Не входит в scope (делается в следующих change'ах): реальные Zod-схемы контракта и MSW-хендлеры (`api-and-mocks`), содержимое страниц (`auctions-list`, `auction-detail`, `bets-view`), форма ставки (`place-bet`), README/AI_USAGE (`delivery-docs`).

## Capabilities

### New Capabilities
- `app-shell`: SPA загружается и рендерит корневой адаптивный layout; провайдеры Query/Router сконфигурированы; MSW-воркер активен в dev-режиме; существует роут-скелет (список, детальная) с обработкой неизвестного маршрута и корневым error boundary.

### Modified Capabilities
<!-- нет: greenfield, изменяемых спеков не существует -->

## Impact

- Новый код: весь каркас репозитория (`src/app`, `src/shared`, конфиги Vite/TS/ESLint/Prettier/Vitest, MSW bootstrap).
- Зависимости: React, TypeScript, Vite, @tanstack/react-router, @tanstack/react-query, react-hook-form, zod, mobx + mobx-react-lite, msw, vitest.
- Публичный контракт API не затрагивается (мок-хендлеры добавляются в `api-and-mocks`).
- Устанавливает конвенции (FSD-границы, `*.component.tsx`), которым следуют все дальнейшие change'и.
