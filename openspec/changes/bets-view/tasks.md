## 1. Data-layer ставок

- [ ] 1.1 Query-хук ставок с ключом `['auction', auctionUuid, 'bets']`, `enabled` по `canViewBets` (из gate-маппера детали)

## 2. Маппер строки ставки (entities/bet)

- [ ] 2.1 Чистый маппер `BetItem -> BetRowVM`: цены с/без НДС, перевозчик, `place` (nullable), `is_win`, `is_rejected`, нормализация `cancel_reason`/пустого телефона
- [ ] 2.2 Подсчёт количества участников в маппере списка

## 3. Виджет списка ставок

- [ ] 3.1 `widgets/bets-list`: строки ставок `*.component.tsx` с выделением победителя и пометкой отменённых (+ причина)
- [ ] 3.2 Отображение количества участников
- [ ] 3.3 Empty-состояние при отсутствии ставок
- [ ] 3.4 Состояние «история скрыта» при `hide_bets_history`
- [ ] 3.5 Встроить как вкладку/раздел в `pages/auction-detail`; адаптив

## 4. Тесты и валидация

- [ ] 4.1 Unit-тесты маппера строки: `cancel_reason=""`, `place=null`, `is_win`/`is_rejected`, цены с/без НДС
- [ ] 4.2 Прогнать `lint`/`test`; проверить empty и скрытую историю вручную в dev
- [ ] 4.3 `openspec validate bets-view --strict` — без ошибок
