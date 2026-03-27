import * as vscode from 'vscode';
import type { CommandPayload } from '../services/terminalManager';
import {
  extractFencedCommands,
  extractInlineCommands,
  CommandMatch,
} from '../parsers/commandParsers';

export class MarkdownCommandLensProvider implements vscode.CodeLensProvider {
  private readonly onDidChangeEmitter = new vscode.EventEmitter<void>();
  public readonly onDidChangeCodeLenses = this.onDidChangeEmitter.event;
  private readonly getSupportedLanguages: () => Set<string>;

  constructor(getSupportedLanguages: () => Set<string>) {
    this.getSupportedLanguages = getSupportedLanguages;
  }

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
    const SUPPORTED_LANGS = this.getSupportedLanguages();
    console.log(`Markdown Command Runner: Providing CodeLens for ${document.uri.fsPath}`);
    const lenses: vscode.CodeLens[] = [];
    const fenced = extractFencedCommands(document);
    const inline = extractInlineCommands(document);
    const all: CommandMatch[] = [...fenced, ...inline];

    for (const match of all) {
      lenses.push(
        new vscode.CodeLens(match.range, {
          title: '$(copy) Copiar',
          command: 'markdown-command-runner.copyContent',
          tooltip: 'Copiar el contenido al portapapeles',
          arguments: [
            {
              content: match.commandText,
            },
          ],
        }),
      );

      const shouldAddRun = match.isBlock
        ? typeof match.language === 'string' && SUPPORTED_LANGS.has(match.language)
        : true;
      if (shouldAddRun) {
        lenses.push(
          new vscode.CodeLens(match.range, {
            title: '$(play) Ejecutar',
            command: 'markdown-command-runner.runCommand',
            tooltip: 'Ejecutar este comando en la terminal integrada',
            arguments: [
              {
                commandText: match.commandText,
                documentUri: document.uri,
              } as CommandPayload,
            ],
          }),
        );
      }
    }

    console.log(`Markdown Command Runner: Found ${lenses.length} executable code blocks`);
    return lenses;
  }
}
