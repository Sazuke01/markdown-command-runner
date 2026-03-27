import * as vscode from 'vscode';

// Lista integrada de lenguajes que se consideran comandos de terminal.
// Se mantiene aquí en código según la petición de integrarlo y evitar dependencias JSON.
export function loadSupportedLanguages(_context: vscode.ExtensionContext): Set<string> {
  const langs = ['shell', 'bash', 'bat', 'powershell', 'cmd', 'sh'];
  const set = new Set<string>(langs.map((s) => s.toLowerCase().trim()));
  console.log(`Markdown Command Runner: Using ${set.size} built-in supported languages`);
  return set;
}
