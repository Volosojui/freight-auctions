## 1. Палитра

- [x] 1.1 Обновить светлые токены в `global.css` (`--primary`/`--accent`/бейджи/статусы) по `design.md`
- [x] 1.2 Обновить тёмные токены в обоих блоках (`prefers-color-scheme` и `[data-theme="dark"]`)
- [x] 1.3 Добавить `.btn--accent` (оранжевый, тёмный текст, hover); проверить контраст ≥ AA в обеих темах

## 2. Акцентные CTA

- [x] 2.1 Карточка списка: bid-CTA (kind create/edit) → вариант `accent` (view/disabled без изменений)
- [x] 2.2 Детальная: `bid-action` → вариант `accent`
- [x] 2.3 Модалка ставки: submit «Поставить» → вариант `accent`

## 3. Чистка drawer фильтров

- [x] 3.1 `AuctionFilters`: убрать обёртку `Card`, рендерить простой `form` (без бордера/тени/padding)
- [x] 3.2 Убрать/обнулить стили `.filters`-как-Card и лишние отступы; ритм формы задаёт `drawer__body`

## 4. Проверка

- [x] 4.1 Прогнать `lint`, `test` (unit+integration) и `test:e2e` — всё зелёное (селекторы сохранены)
- [x] 4.2 Визуально проверить обе темы и 375px; drawer без двойной рамки/отступов
- [x] 4.3 `openspec validate refresh-palette --strict` — без ошибок
