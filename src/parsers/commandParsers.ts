import * as vscode from 'vscode';

export interface CommandMatch {
  commandText: string;
  range: vscode.Range;
  language?: string;
  isBlock: boolean;
}

export function extractFencedCommands(document: vscode.TextDocument): CommandMatch[] {
  const matches: CommandMatch[] = [];
  const totalLines = document.lineCount;
  let line = 0;

  while (line < totalLines) {
    const currentLine = document.lineAt(line);
    const fenceMatch = currentLine.text.match(/^\s*```([\w-]+)?\s*$/);

    if (fenceMatch) {
      const language = fenceMatch[1]?.toLowerCase();
      const fenceLine = line;
      line += 1;

      const commandLines: string[] = [];
      while (line < totalLines) {
        const blockLine = document.lineAt(line);
        if (blockLine.text.trim().startsWith('```')) {
          break;
        }
        commandLines.push(blockLine.text);
        line += 1;
      }

      // skip closing fence if present
      if (line < totalLines && document.lineAt(line).text.trim().startsWith('```')) {
        line += 1;
      }

      const commandText = commandLines.join('\n').replace(/\n+$/g, '').trim();
      if (commandText.length === 0) {
        continue;
      }

      // Anchor CodeLens to the first non-empty line of the fenced block
      let startLineIdx = fenceLine + 1;
      for (let i = 0; i < commandLines.length; i++) {
        if (commandLines[i].trim().length > 0) {
          startLineIdx = fenceLine + 1 + i;
          break;
        }
      }
      const startCol = document.lineAt(startLineIdx).firstNonWhitespaceCharacterIndex;
      const range = new vscode.Range(
        new vscode.Position(startLineIdx, startCol),
        new vscode.Position(startLineIdx, startCol),
      );

      matches.push({
        commandText,
        range,
        language,
        isBlock: true,
      });
      continue;
    }

    line += 1;
  }

  return matches;
}

export function extractInlineCommands(document: vscode.TextDocument): CommandMatch[] {
  const matches: CommandMatch[] = [];
  const totalLines = document.lineCount;

  for (let line = 0; line < totalLines; line++) {
    const currentLine = document.lineAt(line);
    const inlineMatches = [...currentLine.text.matchAll(/run\s+`([^`]+)`/gi)];
    for (const match of inlineMatches) {
      const commandText = match[1].trim();
      if (commandText.length === 0) {
        continue;
      }
      const startCol = match.index ?? 0;
      const endCol = startCol + (match[0]?.length || 0);
      const range = new vscode.Range(
        new vscode.Position(line, startCol),
        new vscode.Position(line, Math.max(endCol, startCol + 1)),
      );

      matches.push({ commandText, range, isBlock: false });
    }
  }

  return matches;
}
