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

## Añadir hooks

Ejemplo común (este repositorio): usar `lint-staged` en el hook `pre-commit`.

1. Configura `lint-staged` en `package.json`:

   ```json
   "lint-staged": {
   "*.{ts,json,jsonc,md,yaml}": "prettier --write --experimental-cli --cache"
   }
   ```

2. Agregar el comando pre-commit

   ```pre-commit
   lint-staged
   ```
