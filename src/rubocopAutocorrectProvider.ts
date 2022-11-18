import * as vscode from 'vscode';
import * as cp from 'child_process';

import { getConfig } from './configuration';
import { getCommandArguments, getCurrentPath } from './helper';
import { log } from './channel';

export default class RubocopAutocorrectProvider
  implements vscode.DocumentFormattingEditProvider {
  public provideDocumentFormattingEdits(document: vscode.TextDocument): vscode.TextEdit[] {
    return this.getAutocorrectEdits(document);
  }

  public getAutocorrectEdits(document: vscode.TextDocument, additionalArguments: string[] = []): vscode.TextEdit[] {
    const config = getConfig();
    try {
      const args = [...getCommandArguments(document.fileName), ...additionalArguments];
      if (additionalArguments.length === 0) args.push('--autocorrect');

      if (config.useServer) {
        args.push('--server');
      }

      const options = {
        cwd: getCurrentPath(document.uri),
        input: document.getText(),
      };

      const cmd = `${config.command} ${args.join(' ')}`;
      log(`autocorrect: ${cmd}`);

      let stdout;
      if (config.useBundler) {
        stdout = cp.execSync(cmd, options);
      } else {
        stdout = cp.execFileSync(config.command, args, options);
      }

      return this.onSuccess(document, stdout);
    } catch (e) {
      // if there are still some offences not fixed RuboCop will return status 1
      if (e.status !== 1) {
        log(`autocorrect: error ${e}`);
        vscode.window.showWarningMessage(
          'An error occurred during auto-correction'
        );
        console.log(e);
        return [];
      } else {
        return this.onSuccess(document, e.stdout);
      }
    }
  }

  // Output of auto-correction looks like this:
  //
  // {"metadata": ... {"offense_count":5,"target_file_count":1,"inspected_file_count":1}}====================
  // def a
  //   3
  // end
  //
  // So we need to parse out the actual auto-corrected ruby
  private onSuccess(document: vscode.TextDocument, stdout: Buffer) {
    log("autocorrect: done");

    const stringOut = stdout.toString();
    const autoCorrection = stringOut.match(
      /^.*\n====================(?:\n|\r\n)([.\s\S]*)/m
    );
    if (!autoCorrection) {
      throw new Error(`Error parsing auto-correction from CLI: ${stringOut}`);
    }
    return [
      new vscode.TextEdit(this.getFullRange(document), autoCorrection.pop()),
    ];
  }

  private getFullRange(document: vscode.TextDocument): vscode.Range {
    return new vscode.Range(
      new vscode.Position(0, 0),
      document.lineAt(document.lineCount - 1).range.end
    );
  }
}
