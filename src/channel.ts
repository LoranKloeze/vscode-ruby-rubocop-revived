import * as vscode from 'vscode';

// output channel (lazy)
export let channel: vscode.OutputChannel | undefined;

// log to our output channel
export function log(message: string) {
  if (!channel) {
    channel = vscode.window.createOutputChannel('Rubocop');
  }

  // log to channel with timestamp
  const now = new Date().toISOString()
  channel.appendLine(`[${now}] ${message}`);
}
