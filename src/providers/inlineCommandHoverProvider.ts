import * as vscode from 'vscode';
import { extractInlineCommands } from '../parsers/commandParsers';

export class InlineCommandHoverProvider implements vscode.HoverProvider {
  public provideHover(
    document: vscode.TextDocument,
    position: vscode.Position,
    _token: vscode.CancellationToken,
  ): vscode.ProviderResult<vscode.Hover> {
    const line = document.lineAt(position.line).text;
    const inlineMatches = [...line.matchAll(/run\s+`([^`]+)`/gi)];

    for (const match of inlineMatches) {
      const matchStart = match.index ?? 0;
      const localBacktickIndex = match[0].indexOf('`');
      const startCol = localBacktickIndex >= 0 ? matchStart + localBacktickIndex + 1 : matchStart;
      const endCol = startCol + (match[1]?.length || 0);

      const range = new vscode.Range(
        new vscode.Position(position.line, startCol),
        new vscode.Position(position.line, Math.max(endCol, startCol + 1)),
      );

      if (range.contains(position)) {
        const commandText = match[1].trim();
        if (commandText.length === 0) return null;

        // Prepare command URIs with encoded JSON arguments
        const runArgs = encodeURIComponent(
          JSON.stringify([{ commandText, documentUri: document.uri.toString() }]),
        );
        const copyArgs = encodeURIComponent(JSON.stringify([{ content: commandText }]));

        const runUri = `command:markdown-command-runner.runCommand?${runArgs}`;
        const copyUri = `command:markdown-command-runner.copyContent?${copyArgs}`;

        const md = new vscode.MarkdownString();
        md.isTrusted = true;
        md.appendMarkdown(`[▶ Ejecutar](${runUri}) \| [📋 Copiar](${copyUri})`);

        return new vscode.Hover(md, range);
      }
    }

    return null;
  }
}
