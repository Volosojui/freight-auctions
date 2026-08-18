## Context

Палитра и стили живут в `src/app/styles/global.css` (токены) + компонентных CSS. Тёмная тема — переопределение токенов в `@media (prefers-color-scheme: dark)` и `:root[data-theme="dark"]`. Кнопки — `.btn--primary/secondary/ghost`. Фильтры рендерятся `AuctionFilters` внутри `Drawer` (`shared/ui/drawer`). См. `proposal.md` — Why. Изменение чисто визуальное (`skip_specs`).

## Goals / Non-Goals

**Goals:** более живой вид (яркий синий + тёплый оранжевый CTA), контраст ≥ AA в обеих темах; убрать двойную обводку и лишние отступы в drawer фильтров.

**Non-Goals:** любое изменение поведения/потоков/разметки-селекторов; новые зависимости.

## Decisions

**Палитра — Bright Blue + Orange CTA.** Обновляем значения существующих токенов (имена не меняем) и добавляем акцентные `--accent*`.

Светлая:
```
--primary:#2563EB  --primary-hover:#1D4ED8  --primary-contrast:#FFFFFF
--accent:#EA580C   --accent-hover:#F97316   --accent-contrast:#1A1207
--brand:#1E293B    --text:#1E293B           --text-muted:#475569
--bg:#F8FAFC  --surface:#FFFFFF  --card:#FFFFFF  --border:#E2E8F0  --border-strong:#CBD5E1
--ring:#2563EB
--success:#16A34A  --success-bg:#ECFDF3  --danger:#DC2626  --danger-bg:#FEF2F2  --warning:#D97706
--badge-bg:#EFF6FF --badge-fg:#1D4ED8  --own-bg:#ECFDF5 --own-fg:#047857
```

Тёмная (десатурированная, не инверсия):
```
--primary:#3B82F6  --primary-hover:#60A5FA  --primary-contrast:#08131F
--accent:#FB7139   --accent-hover:#FD8A5B   --accent-contrast:#1A0E06
--brand:#E6EDF6    --text:#E6EDF6           --text-muted:#9FB0C7
--bg:#0B1220  --surface:#111A2B  --card:#131D30  --border:#25324A  --border-strong:#33425F
--ring:#60A5FA
--success:#4ADE80  --success-bg:#12281C  --danger:#F87171  --danger-bg:#2C1417  --warning:#FBBF24
--badge-bg:#12233A --badge-fg:#93C5FD  --own-bg:#12281C --own-fg:#86EFAC
```

**Кнопка-акцент.** Добавить `.btn--accent { background: var(--accent); color: var(--accent-contrast) }` (тёмный текст на ярком оранжевом — AA-safe и живо; hover — `--accent-hover`). Применить к главным bid-CTA: карточка списка «Сделать/Изменить ставку» (kind create/edit), детальная `bid-action`, submit модалки «Поставить». Остальные primary (Применить, Повторить) остаются синими — один яркий CTA на экран. Смена варианта — только проп/класс, `data-testid`/текст сохраняются.

**Контраст.** Оранжевый CTA с тёмным текстом (`--accent-contrast`) — проверить ≥4.5:1 в обеих темах; синий `--primary` с белым — уже AA. Бейджи blue-tinted — проверить `--badge-fg` на `--badge-bg`.

**Чистка drawer фильтров.** Причина «обводки вокруг всех фильтров» — `AuctionFilters` обёрнут в `Card` (бордер+тень+padding), вложенный в `Drawer__body`, который уже даёт контейнер и padding → двойная рамка и двойные отступы. Решение: `AuctionFilters` рендерит не `Card`, а простой контейнер `form` (без бордера/тени/padding); отступы даёт `drawer__body`. Убрать/обнулить стили `.filters`-как-Card. Внутренний вертикальный ритм формы оставить умеренным (без лишних крупных gap). Компонентный тест фильтров (`status-filter.test`) рендерит форму напрямую — селекторы не меняются.

## Risks / Trade-offs

- [Оранжевый CTA не проходит AA] → Текст тёмный (`--accent-contrast`), значения выбраны под ≥4.5:1; проверить инструментом, при недоборе — сдвинуть оттенок.
- [Слишком «маркетинговый» вид] → Оранжевый только на одном CTA-типе; нейтральные поверхности/текст неизменны.
- [Смена варианта кнопки задевает тесты] → Тесты селектят по `data-testid`/тексту, не по классу; вариант меняем безопасно.

## Open Questions

<!-- нет -->
