import * as vscode from 'vscode';

export interface CommandPayload {
  commandText: string;
  documentUri: vscode.Uri;
}

export class TerminalManager {
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
