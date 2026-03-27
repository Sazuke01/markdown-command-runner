---
agent: agent
---

Define the task to achieve, including specific requirements, constraints, and success criteria.

Proyecto: Markdown command runner

es una extencion para vs code que permite ejecutar comandos de terminal directamente desde bloques de codigo en archivos markdown.

el lenguaje a utilizar es: typescript

features:

- Detecta bloques de codigo de tipo terminal (ya sean shell, bash, zsh, bat, etc) en archivos markdown.
- Agrega un boton "Ejecutar" encima de cada bloque de codigo de terminal.
- Al hacer clic en el boton "Ejecutar", ejecuta el comando en una terminal integrada de VS Code.

tipos de bloques de codigo soportados:

- shell
- bash
- bat
- powershell
- cmd
- sh

formato de codigo markdown:

```bash
echo "Hola, mundo!"
```

```shell
ls -la
```

```bat
dir
```

formato alterno:

run `dir C:\`
