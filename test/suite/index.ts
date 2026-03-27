import * as path from 'path';
import Mocha from 'mocha';
import * as vscode from 'vscode';

export function run(): Promise<void> {
  const mocha = new Mocha({ ui: 'bdd', color: true, timeout: 10000 });
  const testsRoot = path.resolve(__dirname);

  mocha.addFile(path.join(testsRoot, 'extension.test.js'));

  return new Promise((resolve, reject) => {
    mocha.run((failures: number) => {
      if (failures > 0) {
        reject(new Error(`${failures} tests failed.`));
        return;
      }
      resolve();
    });
  });
}

export function activate(): Thenable<vscode.Extension<any>> | undefined {
  const extension = vscode.extensions.getExtension('your-name-here.markdown-command-runner');
  return extension?.activate();
}
