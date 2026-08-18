## Why

После `refresh-palette` bid-CTA стали ярко-оранжевыми (accent) — по ревью это выглядит грубо. Возвращаем bid-кнопки к основному синему и убираем неиспользуемый оранжевый accent. Чисто визуальная правка; поведение и требования не меняются (`skip_specs`).

Примечание: правка уже реализована прямым коммитом; этот change оформляет её в OpenSpec-истории для полноты аудит-следа.

## What Changes

- bid-CTA («Сделать/Изменить ставку» в карточке списка, `bid-action` на детальной, submit «Поставить» в модалке) → вариант `primary` (синий, белый текст) вместо `accent`.
- Удалить неиспользуемый вариант кнопки `accent`: `.btn--accent` из `global.css`, значение из `Variant` в `Button`, токены `--accent`/`--accent-hover`/`--accent-contrast` из всех блоков тем.

Сохраняется: более живая синяя палитра и чистка drawer из `refresh-palette`. Не входит: любое изменение поведения/потоков/селекторов тестов.

## Capabilities

### New Capabilities
<!-- нет: чисто визуальная правка (skip_specs) -->

### Modified Capabilities
<!-- нет: требования capability `ui-design` не меняются -->

## Impact

- Код: `src/app/styles/global.css` (удаление `.btn--accent` и токенов `--accent*`), `src/shared/ui/button/button.component.tsx` (тип `Variant`), варианты кнопок в `entities/auction` карточке, `widgets/auction-detail`, `features/place-bet`.
- Тесты: без изменений по существу; вся свита зелёная (98 unit/integration + 19 e2e). Селекторы сохранены.
- Специи: не затрагиваются (`skip_specs: true`).
