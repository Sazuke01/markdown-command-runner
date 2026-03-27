# Configuración y uso de Husky

## Propósito

- Ejecutar hooks de Git (pre-commit, pre-push) para linters, tests o formateo.

## Instalación

1. Instalar como dependencia de desarrollo:

   ```bash
   pnpm add -D husky
   ```

2. Activar Husky en el repositorio (solo la primera vez):

   ```bash
   pnpm dlx husky install
   ```

3. Añadir script en `package.json` (opcional):

   ```json
   "scripts": {
   "prepare": "husky install"
   }
   ```

## Añadir hooks

Ejemplo: pre-commit para ejecutar ESLint y Prettier:

```bash
pnpm dlx husky add .husky/pre-commit "pnpm run lint && pnpm run format:check"
```

Contenido del hook ejecutable (`.husky/pre-commit`):

```bash
#!/bin/sh
. "$(dirname \"$0\")/_/husky.sh"
pnpm run lint
pnpm run format:check
```

## Recomendaciones

- Mantén Husky en `devDependencies`.
- Los hooks requieren que el repositorio tenga Git inicializado.
- Usa scripts `lint`, `format` y `format:check` en `package.json` para estandarizar los comandos.
