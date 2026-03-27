import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

export function loadSupportedLanguages(context: vscode.ExtensionContext): Set<string> {
  try {
    const configPath = path.join(context.extensionPath, 'src', 'supported-languages.json');
    const configData = fs.readFileSync(configPath, 'utf-8');
    const config = JSON.parse(configData) as { executableLanguages?: Array<string> };
    const langs = (config.executableLanguages || []).map((lang: any) => String(lang).toLowerCase());
    const set = new Set<string>(langs);
    console.log(`Markdown Command Runner: Loaded ${set.size} supported languages`);
    return set;
  } catch (error) {
    console.error('Failed to load supported languages configuration:', error);
    return new Set(['shell', 'bash', 'bat', 'powershell', 'cmd', 'sh']);
  }
}
