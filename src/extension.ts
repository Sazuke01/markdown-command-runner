import * as vscode from 'vscode';
import { loadSupportedLanguages } from './services/supportedLanguages';
import { TerminalManager } from './services/terminalManager';
import { MarkdownCommandLensProvider } from './providers/markdownCommandLensProvider';
import { registerCommands } from './commands';

let terminalManager: TerminalManager | undefined;
let supportedLangs: Set<string> = new Set();

export function activate(context: vscode.ExtensionContext): void {
  console.log('Markdown Command Runner: Extension activated');

  supportedLangs = loadSupportedLanguages(context);

  terminalManager = new TerminalManager(context);

  const lensProvider = new MarkdownCommandLensProvider(() => supportedLangs);
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

  registerCommands(context, terminalManager, lensProvider);
}

export function deactivate(): void {
  terminalManager = undefined;
}
