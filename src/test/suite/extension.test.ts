import 'mocha';
import * as path from 'path';
import * as vscode from 'vscode';
import { expect } from 'chai';

describe('Markdown Command Runner', () => {
  let workspaceFolder: vscode.WorkspaceFolder;

  before(async () => {
    const folders = vscode.workspace.workspaceFolders;
    expect(folders, 'Workspace folders should be available for tests').to.not.be.undefined;
    workspaceFolder = folders![0];
    const extension = vscode.extensions.getExtension('your-name-here.markdown-command-runner');
    await extension?.activate();
  });

  afterEach(async () => {
    // Clean up any test terminals we created so each test starts fresh.
    for (const terminal of vscode.window.terminals) {
      if (terminal.name === 'Markdown Command Runner') {
        terminal.dispose();
      }
    }
    await vscode.commands.executeCommand('workbench.action.closePanel');
  });

  it('provides CodeLens entries for supported fenced blocks and inline snippets', async () => {
    const docUri = vscode.Uri.file(
      path.join(workspaceFolder.uri.fsPath, 'test', 'command-runner-demo.md'),
    );
    const document = await vscode.workspace.openTextDocument(docUri);
    await vscode.window.showTextDocument(document, { preview: false });

    const lenses = await vscode.commands.executeCommand<vscode.CodeLens[]>(
      'vscode.executeCodeLensProvider',
      document.uri,
    );

    expect(lenses, 'CodeLens results should be available').to.be.an('array');
    const runnableLenses = lenses!
      .filter((lens) => lens.command?.command === 'markdown-command-runner.runCommand')
      .map((lens) => {
        const payload = lens.command?.arguments?.[0] as { commandText?: string } | undefined;
        return { lens, payload };
      });
    expect(runnableLenses.length).to.equal(5);

    const bashLens = runnableLenses.find((item) =>
      item.payload?.commandText?.includes('Hola desde bash'),
    );
    expect(bashLens, 'Expected bash snippet lens to be present').to.exist;

    const inlineLens = runnableLenses.find(
      (item) => item.payload?.commandText === 'echo Inline demo',
    );
    expect(inlineLens, 'Expected inline run lens to be present').to.exist;
  });

  it('skips unsupported fenced code blocks', async () => {
    const document = await vscode.workspace.openTextDocument({
      language: 'markdown',
      content: "```python\nprint('nope')\n```",
    });
    await vscode.window.showTextDocument(document, { preview: false });

    const lenses = await vscode.commands.executeCommand<vscode.CodeLens[]>(
      'vscode.executeCodeLensProvider',
      document.uri,
    );

    const runnableLenses = (lenses ?? []).filter(
      (lens) => lens.command?.command === 'markdown-command-runner.runCommand',
    );
    expect(runnableLenses.length).to.equal(0);
  });

  it('creates or reuses a terminal when executing commands', async () => {
    const document = await vscode.workspace.openTextDocument({
      language: 'markdown',
      content: '```bash\necho terminal-test\n```',
    });
    await vscode.window.showTextDocument(document, { preview: false });

    const payload = {
      commandText: 'echo terminal-test',
      documentUri: document.uri,
    };

    await vscode.commands.executeCommand('markdown-command-runner.runCommand', payload);

    // Allow the terminal to spin up.
    await new Promise((resolve) => setTimeout(resolve, 200));

    const terminal = vscode.window.terminals.find(
      (item) => item.name === 'Markdown Command Runner',
    );

    expect(terminal, 'Command execution should create a terminal').to.exist;
    terminal?.dispose();
  });
});
