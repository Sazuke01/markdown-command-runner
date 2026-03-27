Guía rápida para publicar la extensión VS Code

Requisitos previos

- Tener instalado `vsce` (instalar globalmente: `npm i -g vsce`).
- Tener una cuenta en el Marketplace de Visual Studio Code (publisher) y un Personal Access Token (PAT).

Pasos para empaquetar localmente

1. Actualiza la versión en `package.json`.
2. Compila el proyecto: `npm run compile`.
3. Genera el paquete VSIX: `npm run package` (usa el script `package` que ejecuta `vsce package`).

Pasos para publicar

1. Login con `vsce` (si aplica): `vsce login <publisherName>` y pega el PAT.
2. Publica: `vsce publish` o `vsce publish <patch|minor|major>`.

Consejos y buenas prácticas

- Asegúrate de que `engines.vscode` sea compatible con la versión mínima soportada.
- Mantén `version` en semver y actualiza changelog antes de publicar.
- Revisa `package.json` y elimina campos innecesarios (por ejemplo: `sponsor`) antes de publicar.
- Verifica los assets incluidos en `icon` y `resources/`.

Comandos útiles

```
npm run compile
npm run package
vsce publish
```

Referencias

- Documentación vsce: <https://code.visualstudio.com/api/working-with-extensions/publishing-extension>
- vsce (GitHub): <https://github.com/microsoft/vscode-vsce>
