## 1. Search params и состояние фильтров

- [x] 1.1 Zod-схема search params (минимум фильтров ТЗ + `page`/`per_page`) с безопасными fallback на каждое поле
- [x] 1.2 Чистые `parseSearch`/`serializeSearch` (URL ↔ FiltersVM); подключить `validateSearch` к маршруту `/`
- [x] 1.3 MobX-стор черновика фильтров в `features/auction-filters`; «применить» пишет в URL через навигацию роутера

## 2. Data-layer списка

- [x] 2.1 Query-хук списка: ключ из search params, `FiltersVM -> AuctionListRequest` через request builder, `keepPreviousData`
- [x] 2.2 Prefetch детальной по hover/focus карточки (ключ согласован с `auction-detail`)

## 3. Карточка аукциона (entities)

- [x] 3.1 ViewModel-маппер `AuctionListItem -> CardVM` (лейблы enum, форматирование цены/дат, флаг своей ставки)
- [x] 3.2 Расчёт primary action по `can_set_bet`/`is_available`/`your.bet` («Сделать»/«Изменить»/«Смотреть ставки»/disabled) с целевой ссылкой
- [x] 3.3 Компонент карточки `*.component.tsx`: номер, тип, статус, торговый статус, маршрут, даты, груз, цена, цена за км, шаг, флаг ставки, action

## 4. Виджет списка и состояния

- [x] 4.1 `widgets/auctions-list`: рендер карточек + пагинация по `meta`
- [x] 4.2 Состояния skeleton (первичная загрузка), empty (`total = 0`), error (с повтором)
- [x] 4.3 Форма фильтров с `load_city`/`unload_city` из мок-словаря; связать с MobX-стором
- [x] 4.4 Адаптив desktop/mobile без горизонтального скролла

## 5. Страница и интеграция

- [x] 5.1 `pages/auctions-list`: композиция виджета, фильтров и пагинации на маршруте `/`
- [x] 5.2 Проверить восстановление фильтров/страницы из URL по прямой ссылке

## 6. Приёмочные тесты (сценарии спеки)

- [x] 6.1 Unit-тесты `parseSearch`/`serializeSearch` (в т.ч. fallback на некорректный URL)
- [x] 6.2 Unit-тесты ViewModel-маппера карточки (лейблы, primary action по состояниям)
- [x] 6.3 Integration (jsdom+MSW): рендер страницы списка — skeleton при загрузке, список из моков, empty при `total=0`, error с повтором
- [x] 6.4 Integration: фильтр отражается в URL search params и перезапрашивает список; восстановление фильтров/страницы из URL; пагинация
- [x] 6.5 Integration: карточка показывает поля контракта и корректный primary action по состоянию
- [x] 6.6 E2E (Playwright): список→детальная по клику/hover (prefetch), применение фильтра меняет URL и результат

## 7. Валидация

- [x] 7.1 Прогнать `lint`, `test` (unit+integration) и `test:e2e` — всё зелёное
- [x] 7.2 `openspec validate auctions-list --strict` — без ошибок
