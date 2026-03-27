# Configuración y uso de Husky

## Propósito

- Ejecutar hooks de Git (pre-commit, pre-push) para linters, tests o formateo.

## Instalación

1. Instalar como dependencia de desarrollo:

   ```sh
   npm install --save-dev husky
   ```

2. Activar Husky en el repositorio (solo la primera vez):

   ```sh
   npx husky install
   ```

3. Añadir script en `package.json` (opcional):

   ```json
   "scripts": {
   "prepare": "husky install"
   }
   ```

## Añadir hooks

Ejemplo: pre-commit para ejecutar ESLint y Prettier:

```sh
npx husky add .husky/pre-commit "npm run lint && npm run format:check"
```

Contenido del hook ejecutable (`.husky/pre-commit`):

```sh
#!/bin/sh
. "$(dirname \"$0\")/_/husky.sh"
npm run lint
npm run format:check
```

## Recomendaciones

- Mantén Husky en `devDependencies`.
- Los hooks requieren que el repositorio tenga Git inicializado.
- Usa scripts `lint`, `format` y `format:check` en `package.json` para estandarizar los comandos.
