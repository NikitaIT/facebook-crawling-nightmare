# electron-quick-start-typescript

The project has spawned development within a closed source commercial solution.

```bash
# Clone this repository
git clone https://github.com/NikitaIT/facebook-crawling-nightmare
# Go into the repository
cd facebook-crawling-nightmare
# Install dependencies
npm install
```

Next, you need to replace the node_modules/@types/nightmare types with those in the @types/nightmare project. (due to the fact that the namespace nightmare is called as a class, the redefinition could not be configured)

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
