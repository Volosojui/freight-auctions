## 1. Запуск MSW во всех средах

- [x] 1.1 В `src/main.tsx` убрать DEV-гейт: всегда `await worker.start(...)` до рендера (динамический импорт оставить); обновить комментарий
- [x] 1.2 Убедиться, что `public/mockServiceWorker.js` попадает в сборку и раздаётся как `/mockServiceWorker.js`

## 2. Netlify SPA-fallback

- [x] 2.1 Добавить SPA-редирект: `public/_redirects` со строкой `/*  /index.html  200` (или эквивалентный `netlify.toml`)

## 3. Приёмочные тесты

- [x] 3.1 Integration/JSDOM или unit: проверить, что запуск моков не завязан на `import.meta.env.DEV` (воркер стартует независимо от среды)
- [x] 3.2 Проверить production-сборку: `npm run build` + `npm run preview` — список аукционов грузится, ставка проходит (мок работает в prod-сборке)
- [x] 3.3 Проверить прямой переход/refresh на `/auctions/<uuid>` в preview — отдаётся приложение, а не 404

## 4. Документация

- [x] 4.1 Обновить README (MSW работает и в проде; инструкция по деплою на Netlify) и AI_USAGE (снять пункт про «мок не в проде»)

## 5. Валидация

- [x] 5.1 Прогнать `lint`, `test` (unit+integration) и `test:e2e` — всё зелёное
- [x] 5.2 `openspec validate enable-deployed-mocks --strict` — без ошибок
