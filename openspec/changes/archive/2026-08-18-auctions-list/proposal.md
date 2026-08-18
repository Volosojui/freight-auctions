## Why

Список аукционов — точка входа пользователя. Нужна страница, которая грузит данные через TanStack Query, даёт пагинацию, фильтры с синхронизацией в URL (валидные через Zod), состояния загрузки/пустоты/ошибки, prefetch детальной по intent/hover и адаптив. Опирается на слой `api-contract` и `mock-backend` из `api-and-mocks`.

## What Changes

- **Страница списка** (`pages`/`widgets`) на маршруте `/`: загрузка через TanStack Query по `POST /auctions/list`, пагинация через `meta`.
- **Карточка аукциона** (`features`/`entities`): номер заявки, тип аукциона, статус, торговый статус пользователя, маршрут погрузка→выгрузка, даты, груз (название/вес/объём/тип кузова), текущая цена, цена за км, шаг ставки, флаг «моя ставка есть/нет», primary action («Сделать ставку»/«Изменить ставку»/«Смотреть ставки»/disabled) с корректной ссылкой.
- **Фильтры** (минимальный набор из ТЗ): `cargo_num`, `status`, `statuses`, `auc_type`, `load_city`/`unload_city` (из мок-словаря), дата погрузки от/до, `is_available`, `is_bidder`, цена от/до.
- **Синхронизация фильтров и пагинации в URL search params** с Zod-валидацией и безопасными fallback-значениями при некорректном URL.
- **Состояния**: skeleton при загрузке, empty при пустом результате, error c возможностью повтора.
- **Prefetch детальной страницы** по hover/intent над карточкой.
- **Адаптив** desktop/mobile.
- **ViewModel-мапперы** list item → пропсы карточки (+ unit-тесты) и **парсер search params** (+ unit-тесты).

## Capabilities

### New Capabilities
- `auctions-list`: страница списка аукционов — загрузка и пагинация через Query, фильтры с синхронизацией в URL и Zod-валидацией, состояния skeleton/empty/error, prefetch детальной по intent, адаптивные карточки аукционов с primary action.

### Modified Capabilities
<!-- нет -->

## Impact

- Новый код: `src/pages/auctions-list`, `src/widgets/auctions-list`, `src/features/auction-filters`, `src/entities/auction` (ViewModel-мапперы карточки), `src/shared` (утилита search params).
- Зависит от `api-contract` (функции/типы) и `mock-backend` (данные, словарь городов) из `api-and-mocks`.
- Наполняет заглушку маршрута `/` из `bootstrap-app`; primary action ведёт на детальную/форму ставки, реализуемые в `auction-detail`/`place-bet`.
