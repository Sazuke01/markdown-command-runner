# Markdown Command Runner

Markdown Command Runner es una extensión de Visual Studio Code que te permite ejecutar comandos de terminal directamente desde archivos Markdown.

Añade un control **Copiar**, **Ejecutar** en línea a los bloques de código compatibles.

## ✨ Características

- Detecta los bloques de código delimitados etiquetados como `shell`, `bash`, `bat`, `powershell`, `cmd` o `sh` y muestra un CodeLens de **Copiar** y **Ejecutar** encima de cada bloque.

- Reconoce instrucciones en línea como <`` run `dir C:` ``> y proporciona la copiar y ejecución con un solo clic.

- Ejecuta el comando capturado dentro de un terminal integrado de VS Code, manteniendo la salida junto a tu Markdown.

- Reutiliza un terminal por documento para evitar desorden mientras respeta las carpetas de trabajo como directorio actual.

## ⚠️ Notas

- Los comandos se ejecutan con los permisos y la terminal de tu espacio de trabajo actual, así que revisa los fragmentos antes de ejecutarlos.

- Los bloques de múltiples líneas envían cada línea de manera secuencial; asegúrate de que el fragmento sea seguro para ejecutarse línea por línea.

- El terminal respeta el modelo de confianza de VS Code y no se activará en espacios de trabajo no confiables.

## 📄 Licencia MIT
