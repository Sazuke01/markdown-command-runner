# Development Usage Guide

This guide describes how to exercise the Markdown Command Runner extension while developing new features or fixes.

## Prerequisites

- Node.js 18+ (VS Code includes Node 20 in the extension host).
- VS Code 1.85 or later with the `ms-vscode.vscode-typescript-next` extension if you prefer TypeScript IntelliSense previews.

## Build and Watch

1. Install dependencies: run `pnpm install`.
2. Start the TypeScript compiler in watch mode: run `pnpm run compile`.
3. Leave the watch task running so the emitted JavaScript stays fresh while you edit.

## Launch the Extension Host

1. Open the `Run and Debug` view.
2. Pick **Run Extension** and start debugging. VS Code opens a new Extension Development Host window running your local build.

## Manual Testing Checklist

- Open `test/command-runner-demo.md` to see ready-made snippets.
- Confirm that fenced blocks annotated with `bash`, `bash`, `cmd`, `bat`, `powershell`, or `shell` show an **Ejecutar** CodeLens.
- Click **Ejecutar** and verify that a terminal named **Markdown Command Runner** appears with the command output.
- Ensure multi-line blocks execute each line in order without extra blank lines.
- Confirm inline patterns such as `run \`echo Inline demo\`` display the CodeLens and execute correctly.
- Close the terminal and run another snippet to make sure a new terminal spawns, then reopen the same document to see reuse.

## Troubleshooting

- If CodeLens items do not appear, wait for the TypeScript watcher to finish rebuilding or introduce a small edit to the Markdown file to trigger a refresh.
- When debugging, Node may warn about deprecated `punycode` usage or experimental SQLite support. VS Code emits these messages; the extension does not depend on those modules.
- To inspect the command payloads, add temporary `console.log` statements in `src/extension.ts` and monitor the **Debug Console**.

## Finishing Up

- Stop the watch task with `Ctrl+C` when you are done.
- Run `pnpm run compile` once more before packaging to ensure a clean build output.
