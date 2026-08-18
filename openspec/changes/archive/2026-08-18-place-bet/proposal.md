## Why

Ключевое бизнес-действие — установка ставки. Нужна форма «Сделать ставку» по `POST /auctions/{auctionUuid}/bets` с валидацией (RHF+Zod), учётом `min`/`max`/`step`, доступностью по `can_set_bet`, инвалидацией связанных запросов и реальным изменением состояния в MSW-store. Опирается на все предыдущие change'и.

## What Changes

- **Форма «Сделать ставку»** (RHF + Zod), открывается по ссылке/маршруту (из карточки списка и с детальной).
- **Доступность формы** зависит от `trading.can_set_bet`.
- **Валидация**: цена обязательна и `> 0`; учёт `min`, `max`, `step` из detail DTO, если заданы; подсказка по доступной цене и шагу ставки.
- **Mutation** на `POST /auctions/{auctionUuid}/bets`; обработка **422** (`ValidationProblem`) с раскладкой полевых ошибок в форму.
- После успеха — **инвалидация** list/detail/bets query.
- **MSW-store реально обновляется**: текущая цена, торговый статус пользователя и список ставок меняются после успешной ставки (расширение stateful-моков из `api-and-mocks`).
- **success/error toast**.

## Capabilities

### New Capabilities
- `place-bet`: установка ставки — форма RHF+Zod с валидацией цены и учётом `min`/`max`/`step`, доступность по `can_set_bet`, mutation `POST /auctions/{auctionUuid}/bets`, обработка 422, инвалидация list/detail/bets, обновление состояния (текущая цена, торговый статус, список ставок) и toast-уведомления.

### Modified Capabilities
<!-- нет: поведение mock-backend по обновлению состояния после ставки описано здесь как часть capability place-bet (наблюдаемое сквозное поведение фичи) -->

## Impact

- Новый код: `src/features/place-bet` (форма, схема, mutation, MobX-стор состояния модалки/сабмита); расширение `src/shared/api/mock` (мутация store).
- Зависит от `api-contract`/`mock-backend`, `auction-detail` (источник `min`/`max`/`step`/`can_set_bet`), `bets-view` (инвалидация ставок), `auctions-list` (инвалидация списка).
- Завершает сквозной сценарий торгов; после него остаётся только `delivery-docs`.
