## Why

Из списка пользователь переходит на детальную страницу аукциона. Нужна страница, которая по `GET /auctions/{auctionUuid}` показывает полную информацию: основные данные, организатора, контакты (если не скрыты), маршрут со всеми точками, груз и требования к ТС, условия оплаты, параметры торгов, цены (текущая/доступная/min/max/step) и состояние своей ставки, с учётом ограничений из DTO. Опирается на `api-contract`/`mock-backend`.

## What Changes

- **Детальная страница** на маршруте `/auctions/$auctionUuid`: загрузка через TanStack Query по `GET /auctions/{auctionUuid}`, состояния skeleton/error, 404 для несуществующего аукциона.
- **Секции**: основные данные (`main`), организатор (`organizer`), контакты (`contacts`), маршрут со всеми точками (`routes`), груз и требования к ТС (`cargo`), условия оплаты (`payment`), параметры торгов (`trading` + `settings`), цены (`trading.price`: current/available/min/max/step + НДС/без-НДС), состояние своей ставки (`trading.your`).
- **Учёт ограничений DTO**: `can_set_bet` (доступность действия ставки), `hide_bets_history` (скрытие истории ставок), `hide_points_address_and_contacts` (скрытие адресов точек и контактов), `no_view_cargo_price` (скрытие цены груза).
- **Точка входа для ставок и формы ставки**: ссылки/вкладки на `bets-view` и `place-bet` (сами реализуются в своих change'ах).
- **ViewModel-мапперы** детального DTO → пропсы секций (+ unit-тесты).

## Capabilities

### New Capabilities
- `auction-detail`: детальная страница аукциона — загрузка по `GET /auctions/{auctionUuid}`, отображение всех секций (основное, организатор, контакты, маршрут, груз, оплата, торги, цены, своя ставка) с соблюдением ограничений DTO (`can_set_bet`, `hide_bets_history`, `hide_points_address_and_contacts`, `no_view_cargo_price`).

### Modified Capabilities
<!-- нет -->

## Impact

- Новый код: `src/pages/auction-detail`, `src/widgets/auction-detail-*` (секции), `src/entities/auction` (детальные ViewModel-мапперы).
- Зависит от `api-contract`/`mock-backend` (`api-and-mocks`) и от prefetch-ключа из `auctions-list`.
- Наполняет заглушку маршрута `/auctions/$auctionUuid` из `bootstrap-app`; предоставляет точки входа в `bets-view` и `place-bet`.
