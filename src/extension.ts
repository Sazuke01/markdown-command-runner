import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

let SUPPORTED_LANGS: Set<string> = new Set();

function loadSupportedLanguages(context: vscode.ExtensionContext): void {
  try {
    const configPath = path.join(context.extensionPath, 'src', 'supported-languages.json');
    const configData = fs.readFileSync(configPath, 'utf-8');
    const config = JSON.parse(configData);
    SUPPORTED_LANGS = new Set(config.executableLanguages.map((lang: string) => lang.toLowerCase()));
    console.log(`Markdown Command Runner: Loaded ${SUPPORTED_LANGS.size} supported languages`);
  } catch (error) {
    console.error('Failed to load supported languages configuration:', error);
    // Fallback to default languages
    SUPPORTED_LANGS = new Set(['shell', 'bash', 'bat', 'powershell', 'cmd', 'sh']);
  }
}

interface CommandPayload {
  commandText: string;
  documentUri: vscode.Uri;
}

interface CopyPayload {
  content: string;
}

class MarkdownCommandLensProvider implements vscode.CodeLensProvider {
  private readonly onDidChangeEmitter = new vscode.EventEmitter<void>();
  public readonly onDidChangeCodeLenses = this.onDidChangeEmitter.event;

  dispose(): void {
    this.onDidChangeEmitter.dispose();
  }

  refresh(): void {
    this.onDidChangeEmitter.fire();
  }

  provideCodeLenses(
    document: vscode.TextDocument,
    _token: vscode.CancellationToken,
  ): vscode.CodeLens[] {
    console.log(`Markdown Command Runner: Providing CodeLens for ${document.uri.fsPath}`);
    const lenses: vscode.CodeLens[] = [];
    const totalLines = document.lineCount;
    let line = 0;

    while (line < totalLines) {
      const currentLine = document.lineAt(line);
      const fenceMatch = currentLine.text.match(/^\s*```(\w+)\s*$/);

      if (fenceMatch) {
        const language = fenceMatch[1]?.toLowerCase();
        line += 1;

        const commandLines: string[] = [];
        const blockStart = currentLine.range.start;

        while (line < totalLines) {
          const blockLine = document.lineAt(line);
          if (blockLine.text.trim().startsWith('```')) {
            break;
          }
          commandLines.push(blockLine.text);
          line += 1;
        }

        // Consume the closing fence if present.
        if (line < totalLines && document.lineAt(line).text.trim().startsWith('```')) {
          line += 1;
        }

        const commandText = commandLines.join('\n').trim();
        if (commandText.length === 0) {
          continue;
        }

        const range = new vscode.Range(blockStart, blockStart);

        // Add copy button for all code blocks
        lenses.push(
          new vscode.CodeLens(range, {
            title: '$(copy) Copiar',
            command: 'markdown-command-runner.copyContent',
            tooltip: 'Copiar el contenido al portapapeles',
            arguments: [
              {
                content: commandText,
              } satisfies CopyPayload,
            ],
          }),
        );

        // Add run button only for supported languages
        if (SUPPORTED_LANGS.has(language)) {
          lenses.push(
            new vscode.CodeLens(range, {
              title: '$(play) Ejecutar',
              command: 'markdown-command-runner.runCommand',
              tooltip: 'Ejecutar este comando en la terminal integrada',
              arguments: [
                {
                  commandText,
                  documentUri: document.uri,
                } satisfies CommandPayload,
              ],
            }),
          );
        }
        continue;
      }

      const inlineMatches = [...currentLine.text.matchAll(/run\s+`([^`]+)`/gi)];
      for (const match of inlineMatches) {
        const commandText = match[1].trim();
        if (commandText.length === 0) {
          continue;
        }
        const startCol = match.index ?? 0;
        const range = new vscode.Range(
          new vscode.Position(line, startCol),
          new vscode.Position(line, startCol),
        );

        // Add copy button
        lenses.push(
          new vscode.CodeLens(range, {
            title: '$(copy) Copiar',
            command: 'markdown-command-runner.copyContent',
            tooltip: 'Copiar el contenido al portapapeles',
            arguments: [
              {
                content: commandText,
              } satisfies CopyPayload,
            ],
          }),
        );

        // Add run button
        lenses.push(
          new vscode.CodeLens(range, {
            title: '$(play) Ejecutar',
            command: 'markdown-command-runner.runCommand',
            tooltip: 'Ejecutar este comando en la terminal integrada',
            arguments: [
              {
                commandText,
                documentUri: document.uri,
              } satisfies CommandPayload,
            ],
          }),
        );
      }

      line += 1;
    }

    console.log(`Markdown Command Runner: Found ${lenses.length} executable code blocks`);
    return lenses;
  }
}

class TerminalManager {
  private readonly terminals = new Map<string, vscode.Terminal>();
  private readonly extensionContext: vscode.ExtensionContext;

  constructor(context: vscode.ExtensionContext) {
    this.extensionContext = context;
    this.extensionContext.subscriptions.push(
      vscode.window.onDidCloseTerminal((terminal) => {
        for (const [key, value] of this.terminals.entries()) {
          if (value === terminal) {
            this.terminals.delete(key);
            break;
          }
        }
      }),
    );
  }

  runCommand(payload: CommandPayload): void {
    const key = payload.documentUri.toString();
    let terminal = this.terminals.get(key);

    if (!terminal) {
      const workspaceFolder = vscode.workspace.getWorkspaceFolder(payload.documentUri);
      terminal = vscode.window.createTerminal({
        name: 'Markdown Command Runner',
        cwd: workspaceFolder?.uri.fsPath,
      });
      this.terminals.set(key, terminal);
    }

    terminal.show(true);

    const lines = payload.commandText.replace(/\r\n/g, '\n').split('\n');
    for (const line of lines) {
      terminal.sendText(line, true);
    }
  }
}

let terminalManager: TerminalManager | undefined;

export function activate(context: vscode.ExtensionContext): void {
  console.log('Markdown Command Runner: Extension activated');

  // Load supported languages from configuration file
  loadSupportedLanguages(context);

  terminalManager = new TerminalManager(context);

  const lensProvider = new MarkdownCommandLensProvider();
  context.subscriptions.push(lensProvider);

  context.subscriptions.push(
    vscode.languages.registerCodeLensProvider({ language: 'markdown' }, lensProvider),
  );

  context.subscriptions.push(
    vscode.workspace.onDidChangeTextDocument((event) => {
      if (event.document.languageId === 'markdown') {
        lensProvider.refresh();
      }
    }),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      'markdown-command-runner.runCommand',
      (payload: CommandPayload) => {
        if (!terminalManager) {
          vscode.window.showErrorMessage('Markdown Command Runner is not ready.');
          return;
        }

        if (!payload?.commandText) {
          vscode.window.showErrorMessage('No command found to execute.');
          return;
        }

        try {
          terminalManager.runCommand(payload);
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error);
          vscode.window.showErrorMessage(`Failed to run command: ${message}`);
        }
      },
    ),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      'markdown-command-runner.copyContent',
      async (payload: CopyPayload) => {
        if (!payload?.content) {
          vscode.window.showErrorMessage('No content to copy.');
          return;
        }

        try {
          await vscode.env.clipboard.writeText(payload.content);
          vscode.window.showInformationMessage('Contenido copiado al portapapeles');
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error);
          vscode.window.showErrorMessage(`Failed to copy content: ${message}`);
        }
      },
    ),
  );
}

export function deactivate(): void {
  terminalManager = undefined;
}
