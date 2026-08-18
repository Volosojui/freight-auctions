## 1. Data-layer детальной

- [ ] 1.1 Query-хук детали с ключом `['auction', auctionUuid]` (согласован с prefetch из `auctions-list`)
- [ ] 1.2 Обработка 404 `ProblemDetail` → состояние not-found; skeleton/error состояния

## 2. Gate-маппер и ограничения DTO

- [ ] 2.1 Чистый маппер `AuctionShowResponse -> DetailVM` (лейблы enum, форматирование цен/дат)
- [ ] 2.2 Применение флагов в маппере: `hide_points_address_and_contacts` (адреса/контакты), `no_view_cargo_price` (цена груза), `canViewBets` из `hide_bets_history`, `canSetBet`

## 3. Секции-виджеты

- [ ] 3.1 Секция основных данных (`main`) и параметров торгов (`trading` + `settings`)
- [ ] 3.2 Секция организатора и контактов (с учётом скрытия)
- [ ] 3.3 Секция маршрута со всеми точками (`routes`, с учётом скрытия адресов)
- [ ] 3.4 Секция груза и требований к ТС (`cargo`, с учётом скрытия цены груза)
- [ ] 3.5 Секция условий оплаты (`payment`)
- [ ] 3.6 Секция цен (`trading.price`: current/available/min/max/step, НДС/без-НДС) и состояния своей ставки (`trading.your`)

## 4. Страница и точки входа

- [ ] 4.1 `pages/auction-detail`: композиция секций + загрузка на маршруте `/auctions/$auctionUuid`
- [ ] 4.2 Точки входа: переход к `bets-view` (если история не скрыта) и к `place-bet` (если `can_set_bet`)
- [ ] 4.3 Адаптив desktop/mobile без горизонтального скролла

## 5. Приёмочные тесты (сценарии спеки)

- [ ] 5.1 Unit-тесты gate-маппера: каждый флаг скрывает/не скрывает нужные данные; `canSetBet`/`canViewBets`
- [ ] 5.2 Unit-тесты форматирования цен/дат и лейблов enum (включая `Unknown`)
- [ ] 5.3 Integration (jsdom+MSW): рендер детальной — все секции, цены (current/available/min/max/step), состояние своей ставки; skeleton/error
- [ ] 5.4 Integration: соблюдение ограничений DTO — `hide_points_address_and_contacts`, `no_view_cargo_price`, `hide_bets_history`, `can_set_bet=false`; 404 → not-found
- [ ] 5.5 E2E (Playwright): открытие детальной из списка; кейс со скрытыми данными; недоступность действия ставки при `can_set_bet=false`

## 6. Валидация

- [ ] 6.1 Прогнать `lint`, `test` (unit+integration) и `test:e2e` — всё зелёное
- [ ] 6.2 `openspec validate auction-detail --strict` — без ошибок
