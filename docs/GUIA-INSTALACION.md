# Guía de Instalación de la Extensión

Sigue estos pasos para instalar la extensión desarrollada en Visual Studio Code:

1. **Descarga el repositorio**

   ```bash
   git clone https://github.com/tu-usuario/markdown-command-runner.git
   ```

2. **Abre la carpeta en Visual Studio Code**
   - Ve a `Archivo > Abrir carpeta...` y selecciona la carpeta clonada.

3. **Instala las dependencias**

   run `pnpm install`

4. **Compila la extensión**

5. **Ejecuta y prueba la extensión**
   - Presiona `F5` para abrir una nueva ventana de VS Code con la extensión cargada.

6. **Instala la extensión localmente**
   1. Instala el paquete de vs code para extensiones:
      run `npm add -g vsce`

   2. Ejecuta:

      ```bash
         pnpm run compile
         vsce package
      ```

   3. Instala el archivo `.vsix` generado:
      Ve a `Extensiones > ... > Instalar desde VSIX...` y selecciona el archivo.

¡Listo! Ahora puedes usar la extensión en Visual Studio Code.
