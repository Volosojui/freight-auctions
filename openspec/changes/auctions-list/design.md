## Context

Каркас (`bootstrap-app`) и слой данных (`api-and-mocks`) готовы. Маршрут `/` — заглушка. Контракт `AuctionListRequest` содержит ~45 полей; из ТЗ обязателен конкретный минимум фильтров. См. `proposal.md` — Why. Этот change отвечает за UI списка и связывание с data-layer.

## Goals / Non-Goals

**Goals:**
- Один источник истины состояния списка — URL search params; из них строится запрос.
- Чистые, тестируемые границы: парсер/сериализатор search params и ViewModel-маппер карточки — вне React.
- Плавный переход на детальную за счёт prefetch.

**Non-Goals:**
- Содержимое детальной и формы ставки (→ `auction-detail`, `place-bet`); здесь только корректные ссылки/навигация.
- Полный набор из 45 фильтров — реализуем минимум из ТЗ, оставляя расширяемую схему.

## Decisions

**URL как источник истины.** Фильтры + пагинация живут в search params; TanStack Query key выводится из них. Черновик фильтров в форме держим на **MobX**-сторе фичи фильтров, а «применение» пишет в URL (навигация роутера). Так избегаем гонок между формой и URL и делаем состояние шаримым по ссылке. _Альтернатива:_ хранить в React state/Query — отклонено, теряется shareable URL и восстановление из ссылки.

**Zod-валидация search params.** Схема с `.catch`/дефолтами на каждое поле: некорректный тип/значение → безопасный fallback, страница не падает (прямое требование ТЗ). Парсер — чистая функция `parseSearch(raw) -> FiltersVM`, покрыт unit-тестами. Валидацию подключаем к маршруту TanStack Router (`validateSearch`).

**Request builder переиспользуем** из `api-contract`: `FiltersVM -> AuctionListRequest`. Список типов городов — из мок-словаря (`mock-backend`).

**Query-стратегия.** `keepPreviousData` при смене страницы/фильтров, чтобы список не мигал; `staleTime` умеренный. Prefetch детальной — `queryClient.prefetchQuery` по hover/focus карточки с тем же ключом, что использует `auction-detail`.

**ViewModel-маппер.** `auctionListItem -> CardVM`: разбор enum в человекочитаемые лейблы, вычисление primary action по (`can_set_bet`, `is_available`, `your.bet`), форматирование цены/дат. Маппер — чистый, в `entities/auction`, покрыт unit-тестами. Цену за км и шаг берём готовыми из контракта, не вычисляем.

**FSD-раскладка.** `pages/auctions-list` (композиция) → `widgets/auctions-list` (список + пагинация + состояния) → `features/auction-filters` (форма + стор + sync URL), `entities/auction` (карточка + маппер).

## Risks / Trade-offs

- [Рассинхрон формы фильтров и URL] → Единый однонаправленный поток: форма (draft) → apply → URL → query; чтение всегда из URL.
- [Мигание при пагинации] → `keepPreviousData` + skeleton только на первичной загрузке.
- [Избыточные prefetch при быстром hover] → Дебаунс/`onMouseEnter` с отменой; полагаемся на дедупликацию Query по ключу.
- [Разные статусные enum в списке и деталях] → Лейблы enum держим в `entities`, переиспользуем в обоих change'ах.

## Open Questions

- Хранение фильтров в localStorage как альтернатива URL допускается ТЗ; выбираем URL (shareable). localStorage-персист можно добавить позже без изменения специй.
