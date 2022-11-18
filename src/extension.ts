import * as vscode from 'vscode';
import { Rubocop } from './rubocop';
import { onDidChangeConfiguration } from './configuration';
import { channel, log } from './channel';

// entry point of extension
export function activate(context: vscode.ExtensionContext): void {
  'use strict';

  log("activate");

  const diag = vscode.languages.createDiagnosticCollection('ruby');
  context.subscriptions.push(diag);

  const rubocop = new Rubocop(diag);
  const disposable = vscode.commands.registerCommand('ruby.rubocop', (onComplete?: () => void) => {
    const document = vscode.window.activeTextEditor.document;
    rubocop.execute(document, onComplete);
  });

  context.subscriptions.push(disposable);

  const ws = vscode.workspace;

  ws.onDidChangeConfiguration(onDidChangeConfiguration(rubocop));

  ws.textDocuments.forEach((e: vscode.TextDocument) => {
    rubocop.execute(e);
  });

  ws.onDidOpenTextDocument((e: vscode.TextDocument) => {
    rubocop.execute(e);
  });

  ws.onWillSaveTextDocument(() => {
    rubocop.executeAutocorrectOnSave();
  });

  ws.onDidSaveTextDocument((e: vscode.TextDocument) => {
    if (rubocop.isOnSave) {
      rubocop.execute(e);
    }
  });

  ws.onDidCloseTextDocument((e: vscode.TextDocument) => {
    rubocop.clear(e);
  });

  vscode.languages.registerDocumentFormattingEditProvider(
    'ruby',
    rubocop.formattingProvider
  );
  vscode.languages.registerDocumentFormattingEditProvider(
    'gemfile',
    rubocop.formattingProvider
  );

  vscode.languages.registerCodeActionsProvider(
    'ruby',
    rubocop.quickFixProvider
  );
  vscode.languages.registerCodeActionsProvider(
    'gemfile',
    rubocop.quickFixProvider
  );

  const autocorrectDisposable = vscode.commands.registerCommand(
    'ruby.rubocop.autocorrect',
    (...args) => {
      rubocop.executeAutocorrect(
        args,
        () => vscode.commands.executeCommand('ruby.rubocop')
      );
    }
  );

  context.subscriptions.push(autocorrectDisposable);

  const disableCopDisposable = vscode.commands.registerCommand(
    'ruby.rubocop.disableCop',
    (workspaceFolder?: vscode.WorkspaceFolder, copName?: string) => {
      if (workspaceFolder === null || copName === null) return;

      rubocop.disableCop(
        workspaceFolder,
        copName,
        () => vscode.commands.executeCommand('ruby.rubocop')
      );
    }
  );

  context.subscriptions.push(disableCopDisposable);

  //
  // command for showing our output channel
  //

  context.subscriptions.push(
    vscode.commands.registerCommand(
      'ruby.rubocop.showOutputChannel',
      () => channel?.show()
    ));

  log("activated");
}
