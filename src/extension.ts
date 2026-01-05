import * as vscode from 'vscode';
import { AutoAcceptor } from './autoAcceptor';
import { getConfig, setEnabled } from './config';

let autoAcceptor: AutoAcceptor | undefined;
let statusBarItem: vscode.StatusBarItem;
let outputChannel: vscode.OutputChannel;

export function activate(context: vscode.ExtensionContext) {
    outputChannel = vscode.window.createOutputChannel('Auto Accept');
    outputChannel.appendLine('[AutoAccept] Extension activated');

    // Create status bar item
    statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.command = 'autoAccept.toggle';
    updateStatusBar();
    statusBarItem.show();
    context.subscriptions.push(statusBarItem);

    // Initialize auto acceptor
    autoAcceptor = new AutoAcceptor(outputChannel);
    context.subscriptions.push(autoAcceptor);

    // Register toggle command
    const toggleCommand = vscode.commands.registerCommand('autoAccept.toggle', async () => {
        const config = getConfig();
        const newState = !config.enabled;
        await setEnabled(newState);
        updateStatusBar();

        const stateText = newState ? 'enabled' : 'disabled';
        vscode.window.showInformationMessage(`Auto Accept: ${stateText}`);
        outputChannel.appendLine(`[AutoAccept] Toggled to: ${stateText}`);
    });
    context.subscriptions.push(toggleCommand);

    // Register show status command
    const statusCommand = vscode.commands.registerCommand('autoAccept.showStatus', () => {
        const config = getConfig();
        const message = `Auto Accept is ${config.enabled ? 'ON' : 'OFF'}\nPatterns: ${config.patterns.length}\nResponse: "${config.response}"\nDelay: ${config.delay}ms`;
        vscode.window.showInformationMessage(message);
        outputChannel.show();
    });
    context.subscriptions.push(statusCommand);

    // Register quick accept command (keyboard shortcut: Ctrl+Shift+Y)
    const quickAcceptCommand = vscode.commands.registerCommand('autoAccept.quickAccept', () => {
        autoAcceptor?.quickAccept();
    });
    context.subscriptions.push(quickAcceptCommand);

    // Register send approval command
    const sendApprovalCommand = vscode.commands.registerCommand('autoAccept.sendApproval', () => {
        autoAcceptor?.sendApproval();
    });
    context.subscriptions.push(sendApprovalCommand);

    // Listen for configuration changes
    const configListener = vscode.workspace.onDidChangeConfiguration((e) => {
        if (e.affectsConfiguration('autoAccept')) {
            updateStatusBar();
            outputChannel.appendLine('[AutoAccept] Configuration changed');
        }
    });
    context.subscriptions.push(configListener);

    outputChannel.appendLine('[AutoAccept] All commands registered');
    outputChannel.appendLine('[AutoAccept] Use Ctrl+Shift+Y for quick accept');
}

function updateStatusBar(): void {
    const config = getConfig();
    if (config.enabled) {
        statusBarItem.text = '$(check) AutoAccept';
        statusBarItem.tooltip = 'Auto Accept is ON (click to toggle)';
        statusBarItem.backgroundColor = undefined;
    } else {
        statusBarItem.text = '$(x) AutoAccept';
        statusBarItem.tooltip = 'Auto Accept is OFF (click to toggle)';
        statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');
    }
}

export function deactivate() {
    outputChannel?.appendLine('[AutoAccept] Extension deactivated');
    autoAcceptor?.dispose();
}
