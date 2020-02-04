# electron-quick-start-typescript

Проект породолжил развитие в рамках закрытого коммерческого решения.

```bash
# Clone this repository
git clone https://github.com/NikitaIT/facebook-crawling-nightmare
# Go into the repository
cd facebook-crawling-nightmare
# Install dependencies
npm install
```

Далее необходимо заменить типы node_modules/@types/nightmare на те что в проекте @types/nightmare.(из-за того что неймспейс nightmare называется как класс, переопределение настроить не удалось)

```bash
# Run the app
npm start
```

```bash
# Run the test
npm run singletest src/**/test/test.ts
#or all tests
npm test
```
