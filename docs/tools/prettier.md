# Configuración y uso de Prettier

## Propósito

- Formateo consistente de código (automático y rápido) para `md`, `json`, `yaml`, `ts` y otros formatos.

## Instalación

```
npm install --save-dev prettier
```

## Archivo de configuración recomendado (`.prettierrc`)

```json
{
  "printWidth": 100,
  "singleQuote": true,
  "trailingComma": "all",
  "tabWidth": 2,
  "endOfLine": "lf"
}
```

## Scripts en `package.json`

```json
 "scripts": {
  "format": "prettier --write '**/*.{ts,js,md,json,yaml}'",
  "format:check": "prettier --check '**/*.{ts,js,md,json,yaml}'"
 }
```

## Integración con ESLint

- Instala `eslint-config-prettier` y `eslint-plugin-prettier` si quieres que ESLint reporte problemas de formato.

## Notas

- `depcheck` puede marcar `prettier` como no usado si sólo lo ejecutas desde scripts o hooks; eso no significa que no sea útil. Revisa el uso en `package.json` y hooks antes de desinstalar.

## Ignorar archivos (`.prettierignore`)

Ejemplo para ignorar build, node_modules y archivos generados:

```
node_modules
out
dist
*.min.js
```

## Uso por archivo

- Markdown (`.md`): formatea bloques de código y el texto plano; útil para documentación y `test` fixtures.
- JSON (`.json`): Prettier formatea con indentación consistente (útil para `package.json`, configuraciones, lock files no cambiados por lock).
- YAML (`.yaml`): Prettier soporta YAML y mantiene la sintaxis sensata (espacios, guiones).
- TypeScript (`.ts`): combina bien con ESLint; usa `--write` en hooks para evitar commits con formato incorrecto.

## Integración con editores

- Habilita "Format on Save" en VS Code o configura el formateador por defecto a Prettier.
- Extensión recomendada: Prettier - Code formatter.

## Integración con Husky (hooks Git)

Ejemplo de hook pre-commit que comprueba formato y aplica arreglos automáticos:

```
npx husky add .husky/pre-commit "npm run format:check || (npm run format && git add -A)"
```

O ejecutar sólo formateo antes de commit:

```
npx husky add .husky/pre-commit "npm run format && git add -A"
```

## Comandos útiles

```bash
npm run format        # formatea los archivos
npm run format:check  # comprueba si hay archivos sin formatear
npx prettier --write file.md
```
