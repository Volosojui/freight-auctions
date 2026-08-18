## Context

Каркас и data-layer готовы; маршрут `/auctions/$auctionUuid` — заглушка с доступным параметром. Детальный DTO (`AuctionShowResponse`) объёмный: вложенные секции, двойные цены, множество булевых ограничений. См. `proposal.md` — Why. Этот change — про рендер деталей и корректное соблюдение флагов.

## Goals / Non-Goals

**Goals:**
- Ограничения DTO (`hide_*`, `no_view_cargo_price`, `can_set_bet`) применяются в одном месте — на уровне маппера/gate, чтобы UI не решал их разрозненно.
- Ключ Query согласован с prefetch из `auctions-list` (мгновенный переход).

**Non-Goals:**
- Рендер самого списка ставок и формы ставки (→ `bets-view`, `place-bet`); здесь только точки входа/ссылки.
- Realtime-обновление торгов; только загрузка/инвалидация по запросу.

## Decisions

**Единый query-ключ детали.** `['auction', auctionUuid]` — тот же, что использует prefetch в `auctions-list`, чтобы переход отдавал данные из кэша. `staleTime` умеренный; ошибка 404 маппится в состояние not-found (по типизированному `ProblemDetail` из `api-contract`).

**Ограничения через gate-слой.** Чистый маппер `AuctionShowResponse -> DetailVM` применяет флаги: при `hide_points_address_and_contacts` вырезает адреса/контакты, при `no_view_cargo_price` — цену груза, отдаёт `canViewBets` (по `hide_bets_history`) и `canSetBet`. UI рендерит по VM и не проверяет флаги сам. Так скрытие консистентно и покрыто unit-тестами. _Альтернатива:_ разбросать проверки по компонентам — отклонено, легко упустить один флаг.

**Секции как виджеты.** Каждая крупная секция (organizer/contacts, route, cargo+requirements, payment, trading+price, your-bet) — отдельный компонент `*.component.tsx`, получает готовую под-VM. Композиция — в `pages/auction-detail`.

**Цены.** Берём поля контракта как есть (с НДС/без-НДС, min/max/step, available); клиент ничего не пересчитывает. Отсутствующие (`null`) поля скрываем, а не показываем нулями.

**FSD-раскладка.** `pages/auction-detail` (композиция + загрузка) → `widgets/auction-detail-*` (секции) → `entities/auction` (DetailVM-маппер, переиспользует лейблы enum из `auctions-list`).

## Risks / Trade-offs

- [Пропустить один из флагов скрытия] → Централизованный маппер + отдельные unit-тесты на каждый флаг (скрывает/не скрывает).
- [Рассинхрон лейблов enum со списком] → Общие лейблы в `entities/auction`, единый источник.
- [Большой DTO → раздутые компоненты] → Разбивка на секции-виджеты с узкими под-VM.

## Open Questions

<!-- нет: форма ответа detail полностью описана контрактом -->
