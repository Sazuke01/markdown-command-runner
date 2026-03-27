import * as vscode from 'vscode';
import { TerminalManager } from './services/terminalManager';
import { MarkdownCommandLensProvider } from './providers/markdownCommandLensProvider';

export function registerCommands(
  context: vscode.ExtensionContext,
  terminalManager: TerminalManager,
  lensProvider: MarkdownCommandLensProvider,
): void {
  context.subscriptions.push(
    vscode.commands.registerCommand(
      'markdown-command-runner.runCommand',
      (payload: { commandText: string; documentUri: vscode.Uri }) => {
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
      async (payload: { content: string }) => {
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
