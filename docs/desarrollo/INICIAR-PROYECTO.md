# Configuraciones para iniciar el proyecto desde 0

run `npm install --save-dev husky lint-staged eslint`

## configuración Prettier

Configuración inicial en un proyecto:

```bash
npm install --save-dev --save-exact prettier
node --eval "fs.writeFileSync('.prettierrc','{}\n')"
node --eval "fs.writeFileSync('.prettierignore','# Ignore artifacts:\nbuild\ncoverage\n')"
```

```bash
# ver qué subiría
npx npm-check-updates
# actualiza package.json
npx npm-check-updates -u
 # actualiza lockfile
npm install
```
