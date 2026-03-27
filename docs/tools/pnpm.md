# Uso de pnpm (instalación y comandos útiles)

## ¿Por qué usar pnpm?

- Menor uso de disco y store compartida.
- Instalaciones más rápidas.
- Layout estricto que detecta dependencias faltantes.

## Instalar pnpm

Instalar globalmente (opcional):

```bash
npm install -g pnpm
# o, en Node >=16.9, usar corepack:
corepack enable
corepack prepare pnpm@latest --activate
```

## Migrar desde npm (opcional)

```bash
# eliminar node_modules y lock antiguo
rm -rf node_modules package-lock.json
# convertir package-lock.json a pnpm-lock.yaml (si hay lock previo)
pnpm import
# instalar dependencias
pnpm install
```

## Comandos básicos

- Instalar dependencias (equivalente a `npm ci`/`npm install`):

```bash
pnpm install --frozen-lockfile
```

- Instalar un paquete como dependencia:

```bash
pnpm add <paquete>
```

- Instalar como devDependency:

```bash
pnpm add -D <paquete>
```

- Desinstalar un paquete:

```bash
pnpm remove <paquete>
```

- Ejecutar un script de `package.json`:

```bash
pnpm run <script>
```

- Actualizar dependencias:

```bash
pnpm update
```

- Ver por qué está instalado un paquete:

```bash
pnpm why <paquete>
```

- Consultar paquetes desactualizados:

```bash
pnpm outdated
```

## Detectar paquetes sin uso

- Usar `depcheck` (recomendado). `depcheck` analiza el código fuente y reporta dependencias no utilizadas y dependencias faltantes.

con pnpm (usa dlx similar a npx)
run `pnpm dlx depcheck`
o con npx
run `npx depcheck`

````

- `depcheck` mostrará secciones como `Unused dependencies`, `Unused devDependencies` y `Missing dependencies`.

- Comprobar por qué se instaló un paquete (útil para investigar):

```bash
pnpm why <paquete>
````

- Nota: `depcheck` puede dar falsos positivos para paquetes usados dinámicamente (strings, llamadas desde configuraciones, herramientas externas). Revisa manualmente antes de desinstalar.

## Comandos útiles para monorepos / workspaces

- Ejecutar un comando en todos los paquetes:

```bash
pnpm -w run build   # -w = workspace
```

- Ejecutar recursivamente en subpaquetes:

```bash
pnpm -r run test
```

## Caché y store

- Información del store global:

```bash
pnpm store path
pnpm store status
```

## Integración CI (ejemplo GitHub Actions)

Reemplaza `npm ci` por:

```yaml
- name: Setup pnpm
  uses: pnpm/action-setup@v2

- name: Install dependencies
  run: pnpm install --frozen-lockfile
```

## Migrar de vuelta a npm

```bash
rm -rf node_modules pnpm-lock.yaml
npm install
```

## Notas y precauciones

- El layout estricto puede exponer paquetes que antes funcionaban por hoisting implícito; corrige `dependencies` faltantes si algo rompe.
- Si usas herramientas de empaquetado antiguas, puede ser necesario `--shamefully-hoist` (usar sólo si hace falta).
- Asegura que los colaboradores y CI adopten pnpm o mantén ambos workflows.

## Comandos rápidos de ejemplo

```bash
pnpm install
pnpm add -D eslint prettier
pnpm remove @types/json5
pnpm -r run build
```
