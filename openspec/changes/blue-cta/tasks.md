## 1. bid-CTA → синий primary

- [x] 1.1 Карточка списка: bid-CTA (kind create/edit) → вариант `primary`
- [x] 1.2 Детальная: `bid-action` → вариант `primary`
- [x] 1.3 Модалка ставки: submit «Поставить» → `primary` (дефолт)

## 2. Удаление accent

- [x] 2.1 Убрать `.btn--accent` из `global.css` и токены `--accent`/`--accent-hover`/`--accent-contrast` из всех блоков
- [x] 2.2 Убрать значение `'accent'` из типа `Variant` в `Button`

## 3. Проверка

- [x] 3.1 Прогнать `lint`, `test` (unit+integration) и `test:e2e` — всё зелёное
- [x] 3.2 `openspec validate blue-cta --strict` — без ошибок
