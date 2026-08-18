## 1. Search params и состояние фильтров

- [ ] 1.1 Zod-схема search params (минимум фильтров ТЗ + `page`/`per_page`) с безопасными fallback на каждое поле
- [ ] 1.2 Чистые `parseSearch`/`serializeSearch` (URL ↔ FiltersVM); подключить `validateSearch` к маршруту `/`
- [ ] 1.3 MobX-стор черновика фильтров в `features/auction-filters`; «применить» пишет в URL через навигацию роутера

## 2. Data-layer списка

- [ ] 2.1 Query-хук списка: ключ из search params, `FiltersVM -> AuctionListRequest` через request builder, `keepPreviousData`
- [ ] 2.2 Prefetch детальной по hover/focus карточки (ключ согласован с `auction-detail`)

## 3. Карточка аукциона (entities)

- [ ] 3.1 ViewModel-маппер `AuctionListItem -> CardVM` (лейблы enum, форматирование цены/дат, флаг своей ставки)
- [ ] 3.2 Расчёт primary action по `can_set_bet`/`is_available`/`your.bet` («Сделать»/«Изменить»/«Смотреть ставки»/disabled) с целевой ссылкой
- [ ] 3.3 Компонент карточки `*.component.tsx`: номер, тип, статус, торговый статус, маршрут, даты, груз, цена, цена за км, шаг, флаг ставки, action

## 4. Виджет списка и состояния

- [ ] 4.1 `widgets/auctions-list`: рендер карточек + пагинация по `meta`
- [ ] 4.2 Состояния skeleton (первичная загрузка), empty (`total = 0`), error (с повтором)
- [ ] 4.3 Форма фильтров с `load_city`/`unload_city` из мок-словаря; связать с MobX-стором
- [ ] 4.4 Адаптив desktop/mobile без горизонтального скролла

## 5. Страница и интеграция

- [ ] 5.1 `pages/auctions-list`: композиция виджета, фильтров и пагинации на маршруте `/`
- [ ] 5.2 Проверить восстановление фильтров/страницы из URL по прямой ссылке

## 6. Приёмочные тесты (сценарии спеки)

- [ ] 6.1 Unit-тесты `parseSearch`/`serializeSearch` (в т.ч. fallback на некорректный URL)
- [ ] 6.2 Unit-тесты ViewModel-маппера карточки (лейблы, primary action по состояниям)
- [ ] 6.3 Integration (jsdom+MSW): рендер страницы списка — skeleton при загрузке, список из моков, empty при `total=0`, error с повтором
- [ ] 6.4 Integration: фильтр отражается в URL search params и перезапрашивает список; восстановление фильтров/страницы из URL; пагинация
- [ ] 6.5 Integration: карточка показывает поля контракта и корректный primary action по состоянию
- [ ] 6.6 E2E (Playwright): список→детальная по клику/hover (prefetch), применение фильтра меняет URL и результат

## 7. Валидация

- [ ] 7.1 Прогнать `lint`, `test` (unit+integration) и `test:e2e` — всё зелёное
- [ ] 7.2 `openspec validate auctions-list --strict` — без ошибок
