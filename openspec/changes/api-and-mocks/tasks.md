## 1. Контрактные модели (entities)

- [ ] 1.1 Описать Zod-схемы enum'ов с приведением неизвестного значения к `Unknown` (`AuctionType`, `AuctionStatus`, `TradingStatus`, `BidMeasurementType`, `PaymentDelayType`, `OperationType`)
- [ ] 1.2 Zod-схемы + типы для элемента списка (`AuctionListItem` и вложенные: main, route, cargo, trading, price, your, organizer, payment)
- [ ] 1.3 Zod-схемы + типы для детальной (`AuctionShowResponse` и вложенные: main, organizer, contacts, cargo, trading + settings/price/your, payment, assembly, routes, admitted_organizations)
- [ ] 1.4 Zod-схемы + типы для ставки (`BetItem`, `BetItemPriceInfo`, `BetListResponse`)
- [ ] 1.5 Zod-схемы для `AuctionListRequest`, `AuctionListMeta`, `SetBetRequest`
- [ ] 1.6 Zod-схемы ошибок `ProblemDetail` и `ValidationProblem`/`ValidationError`; аккуратно смоделировать nullable-поля во всех DTO

## 2. Слой доступа (shared/api)

- [ ] 2.1 Базовый fetch-клиент (базовый URL, JSON, проброс статуса)
- [ ] 2.2 Request builder для `AuctionListRequest`: опускание пустых фильтров, сериализация массивов, даты ISO 8601 со смещением, пагинация/сортировка
- [ ] 2.3 Единый парсер ошибок: различение `ValidationProblem` (422, `errors[]`) и `ProblemDetail`, возврат типизированного union
- [ ] 2.4 Функции эндпоинтов `listAuctions`, `getAuction`, `listBets`, `setBet` с валидацией ответа соответствующей Zod-схемой

## 3. Мок-бэкенд: store и данные

- [ ] 3.1 In-memory store (аукционы, ставки, индексы по uuid) с `reset()`/фабрикой для тестов
- [ ] 3.2 Детерминированный словарь городов для `load_city`/`unload_city`
- [ ] 3.3 Сид-фикстуры аукционов и ставок, покрывающие разнообразие: типы/статусы аукциона, торговые статусы, `can_set_bet` true/false, `hide_bets_history`, `hide_points_address_and_contacts`, `no_view_cargo_price`, наличие/отсутствие своей ставки, пустой список ставок
- [ ] 3.4 Чистые функции фильтрации и пагинации над store (с расчётом `meta`)

## 4. Мок-бэкенд: MSW-хендлеры

- [ ] 4.1 `POST /auctions/list` — применение фильтров, пагинация, `meta`; пустой результат
- [ ] 4.2 `GET /auctions/{auctionUuid}` — детальный DTO из store; 404 `ProblemDetail` для неизвестного uuid
- [ ] 4.3 `GET /auctions/{auctionUuid}/bets` — ставки из store, согласованность с `hide_bets_history`; 404 для неизвестного uuid
- [ ] 4.4 `POST /auctions/{auctionUuid}/bets` — контур статусов 200/404/422 (`ValidationProblem` при `price <= 0`); без мутации store (мутация — в `place-bet`)
- [ ] 4.5 Зарегистрировать хендлеры в MSW-воркере и тест-сервере из `bootstrap-app`

## 5. Тесты чистой логики

- [ ] 5.1 Unit-тесты request builder (опускание пустых, сериализация массивов/дат, пагинация)
- [ ] 5.2 Unit-тесты Zod-парсинга: приведение неизвестного enum к `Unknown`, обработка nullable-полей
- [ ] 5.3 Unit-тесты парсера ошибок: `ProblemDetail` vs `ValidationProblem` (422 с `errors[]`)
- [ ] 5.4 Контрактные тесты хендлеров: форма ответов list/detail/bets соответствует Zod-схемам, пагинация и 404 корректны

## 6. Проверка и валидация

- [ ] 6.1 Прогнать `lint` и `test`; убедиться, что моки отдают данные, проходящие валидацию схемами
- [ ] 6.2 `openspec validate api-and-mocks --strict` — без ошибок
