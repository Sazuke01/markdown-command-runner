run `npm ls`
run `npm why <pkg>`
run `npx depcheck`

```sh
findstr /S /I "mocha" *.ts *.js *.json
grep -R "mocha" .
```

```sh
npm audit
npm audit fix
npm audit fix --force   # usar con cuidado (posibles breaking changes)
npm why mocha
npx depcheck
```
