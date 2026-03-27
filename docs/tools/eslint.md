# Configuración y uso de ESLint

## Propósito

- Analizar código TypeScript/JavaScript y detectar problemas de estilo y errores.

## Instalación básica

```
pnpm add -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

## Configuración mínima (`.eslintrc.json`)

```json
{
  "env": { "es2021": true, "node": true },
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint"],
  "extends": ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  "parserOptions": { "ECMAVersion": 2020, "sourceType": "module" }
}
```

## Scripts recomendados en `package.json`

```json
"scripts": {
  "lint": "eslint 'src/**/*.{ts,js}'",
  "lint:fix": "eslint 'src/**/*.{ts,js}' --fix"
}
```

## Integración con Prettier

- Para evitar conflictos, instala `eslint-config-prettier` y `eslint-plugin-prettier` si usas Prettier.

```
pnpm add -D eslint-config-prettier eslint-plugin-prettier
```

Y añade en `.eslintrc.json`:

```json
"extends": ["eslint:recommended", "plugin:@typescript-eslint/recommended", "plugin:prettier/recommended"]
```

## Notas

- `depcheck` puede marcar `eslint` como "unused" si no se invoca desde código; no significa que no debas mantenerlo si lo usas en CI o localmente.
