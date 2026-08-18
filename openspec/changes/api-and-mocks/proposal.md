## Why

`bootstrap-app` даёт каркас, но в нём нет ни контрактных типов, ни данных: все фичи (`auctions-list`, `auction-detail`, `bets-view`, `place-bet`) зависят от единого слоя доступа к API и от stateful MSW-моков, точно соответствующих OpenAPI. Этот change переводит `docs/openapi.auctions.v0.json` в код (Zod-схемы + типы), даёт типобезопасные API-функции для четырёх эндпоинтов и in-memory MSW-store с сид-данными и словарём городов. Backend не пишем — моки и есть «источник правды» рантайма.

## What Changes

- **Контрактные модели (`entities`)**: Zod-схемы и выведенные из них TS-типы для всех DTO схемы — list item, detail, bet, enum'ы (`AuctionType`, `AuctionStatus`, `TradingStatus`, `BidMeasurementType`, `PaymentDelayType`, `OperationType` — все с `Unknown`), цены с НДС/без НДС, nullable-поля, `ProblemDetail` и `ValidationProblem`.
- **Слой доступа (`shared/api`)**: базовый fetch-клиент, request builder для `AuctionListRequest` (~45 фильтров/пагинация/сортировка) и четыре типобезопасные функции: `listAuctions`, `getAuction`, `listBets`, `setBet`. Ответы валидируются Zod-схемами.
- **MSW-хендлеры на read-эндпоинты** (`POST /auctions/list`, `GET /{uuid}`, `GET /{uuid}/bets`), отдающие данные, строго соответствующие схеме, с реальной пагинацией и `meta`.
- **Stateful in-memory store** моков: сид-набор аукционов + ставок + словарь городов (`load_city`/`unload_city`), детерминированная генерация. Store — единственный источник состояния моков; на этом этапе read-only, mutation расширяется в `place-bet`.
- **Заглушка `setBet`-хендлера**: принимает контракт `SetBetRequest`, возвращает корректный ответ/ошибки-контур (полное изменение состояния — в `place-bet`).
- **Unit-тесты чистой логики**: request builder (сериализация фильтров/пагинации) и парсинг/валидация ответов Zod-схемами.

## Capabilities

### New Capabilities
- `api-contract`: типобезопасный слой доступа к четырём эндпоинтам аукционов — request builder фильтров списка, вызов эндпоинтов и валидация запросов/ответов по контракту OpenAPI (enum с `Unknown`, nullable-поля, `ProblemDetail`/`ValidationProblem`).
- `mock-backend`: stateful in-memory MSW-бэкенд, обслуживающий read-эндпоинты в соответствии со схемой — сид-данные аукционов и ставок, словарь городов, пагинация с `meta`, применение фильтров.

### Modified Capabilities
<!-- нет: app-shell не меняется; api-and-mocks добавляет новые capability -->

## Impact

- Новый код: `src/shared/api/contract/*` (Zod-схемы + типы), `src/shared/api/*` (клиент, request builder, парсер ошибок, эндпоинты), `src/shared/api/mock/*` (store, seed, словарь городов, хендлеры). Слой `entities` в этом change не наполняется — ViewModel-мапперы поверх контракта идут в фиче-change'ах (FSD: `shared` не импортирует «вверх» из `entities`).
- Зависимости: zod (уже в стеке), msw (уже подключён в `bootstrap-app`). Опционально — генератор данных, если решим в design.
- Наполняет пустые MSW-хендлеры и `shared/api/mock`, заведённые в `bootstrap-app`.
- Разблокирует все продуктовые change'и: список, детальную, ставки, форму ставки.
