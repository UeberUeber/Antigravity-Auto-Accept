import * as vscode from 'vscode';
import { getConfig } from './config';

/**
 * AutoAcceptor - Antigravity 내장 accept 명령어를 500ms마다 자동 실행
 * 
 * 승인이 필요한 시점에 도달하면 즉시 자동으로 실행됨
 */
export class AutoAcceptor implements vscode.Disposable {
    private disposables: vscode.Disposable[] = [];
    private outputChannel: vscode.OutputChannel;
    private pollingInterval: NodeJS.Timeout | null = null;
    private isEnabled = true;

    // Antigravity 내장 accept 명령어들
    private readonly ACCEPT_COMMANDS = [
        'antigravity.agent.acceptAgentStep',    // 에이전트 단계 승인
        'antigravity.command.accept',           // 일반 명령어 승인
        'antigravity.terminalCommand.accept',   // 터미널 명령어 승인
    ];

    constructor(outputChannel: vscode.OutputChannel) {
        this.outputChannel = outputChannel;
        this.initialize();
    }

    private initialize(): void {
        const config = getConfig();
        this.isEnabled = config.enabled;

        if (this.isEnabled) {
            this.startPolling();
        }

        this.outputChannel.appendLine('[AutoAccept] ✅ Initialized');
        this.outputChannel.appendLine('[AutoAccept] 🔄 Polling every 500ms for accept commands');
    }

    private startPolling(): void {
        if (this.pollingInterval) {
            return;
        }

        this.pollingInterval = setInterval(() => {
            this.tryAcceptAll();
        }, 500); // 500ms 주기

        this.outputChannel.appendLine('[AutoAccept] ▶️ Auto-accept polling started');
    }

    private stopPolling(): void {
        if (this.pollingInterval) {
            clearInterval(this.pollingInterval);
            this.pollingInterval = null;
            this.outputChannel.appendLine('[AutoAccept] ⏹️ Auto-accept polling stopped');
        }
    }

    private async tryAcceptAll(): Promise<void> {
        if (!this.isEnabled) {
            return;
        }

        for (const command of this.ACCEPT_COMMANDS) {
            try {
                await vscode.commands.executeCommand(command);
                // 명령이 성공하면 (승인할 게 있었으면) 로그
                this.outputChannel.appendLine(`[AutoAccept] ✅ Executed: ${command}`);
            } catch (e) {
                // 승인할 게 없으면 에러 발생 - 무시 (정상)
            }
        }
    }

    public toggle(): void {
        this.isEnabled = !this.isEnabled;

        if (this.isEnabled) {
            this.startPolling();
            vscode.window.showInformationMessage('Auto Accept: ON');
        } else {
            this.stopPolling();
            vscode.window.showInformationMessage('Auto Accept: OFF');
        }

        this.outputChannel.appendLine(`[AutoAccept] Toggled: ${this.isEnabled ? 'ON' : 'OFF'}`);
    }

    public getStatus(): string {
        return this.isEnabled ? '✅ AUTO MODE (500ms polling)' : '⏹️ DISABLED';
    }

    // 백업용 수동 함수들
    public quickAccept(): void {
        const terminal = vscode.window.activeTerminal;
        if (terminal) {
            terminal.sendText('y', true);
            this.outputChannel.appendLine('[AutoAccept] Quick accept sent');
        }
    }

    public sendApproval(): void {
        const config = getConfig();
        const terminal = vscode.window.activeTerminal;
        if (terminal) {
            terminal.sendText(config.response, true);
        }
    }

    dispose(): void {
        this.stopPolling();
        this.disposables.forEach(d => d.dispose());
    }
}
