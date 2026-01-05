import * as vscode from 'vscode';

export interface AutoAcceptConfig {
    enabled: boolean;
    patterns: string[];
    response: string;
    delay: number;
}

export function getConfig(): AutoAcceptConfig {
    const config = vscode.workspace.getConfiguration('autoAccept');
    return {
        enabled: config.get<boolean>('enabled', true),
        patterns: config.get<string[]>('patterns', [
            '\\[Y/n\\]',
            '\\[y/N\\]',
            '\\(y/n\\)',
            '\\(Y/n\\)',
            'Press Enter to continue',
            'Accept\\?',
            'Approve\\?',
            'Confirm\\?',
            'Run command\\?',
            'Execute\\?',
            'Proceed\\?'
        ]),
        response: config.get<string>('response', 'y'),
        delay: config.get<number>('delay', 100)
    };
}

export function setEnabled(enabled: boolean): Thenable<void> {
    const config = vscode.workspace.getConfiguration('autoAccept');
    return config.update('enabled', enabled, vscode.ConfigurationTarget.Global);
}
