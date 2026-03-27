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

    // Ensure terminal is visible and allow it a short moment to initialize
    terminal.show(true);

    const lines = payload.commandText.replace(/\r\n/g, '\n').split('\n');
    this.sendLines(terminal, lines);
  }

  // Send lines sequentially with small delays to avoid racing with terminal init
  private sendLines(terminal: vscode.Terminal, lines: string[]): void {
    let i = 0;
    const sendNext = () => {
      if (i >= lines.length) return;
      const line = lines[i++] || '';
      terminal.sendText(line, true);
      setTimeout(sendNext, 25);
    };

    // Start after a short delay to give the terminal time to be ready
    setTimeout(sendNext, 100);
  }
}
