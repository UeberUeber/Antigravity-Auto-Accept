import * as vscode from 'vscode';

export class SidebarProvider implements vscode.WebviewViewProvider {
    _view?: vscode.WebviewView;
    _doc?: vscode.TextDocument;

    constructor(private readonly _extensionUri: vscode.Uri) { }

    public resolveWebviewView(
        webviewView: vscode.WebviewView,
        context: vscode.WebviewViewResolveContext,
        _token: vscode.CancellationToken,
    ) {
        this._view = webviewView;

        webviewView.webview.options = {
            // Allow scripts in the webview
            enableScripts: true,
            localResourceRoots: [
                this._extensionUri
            ]
        };

        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

        webviewView.webview.onDidReceiveMessage(async (data) => {
            switch (data.type) {
                case 'onInfo': {
                    if (!data.value) {
                        return;
                    }
                    vscode.window.showInformationMessage(data.value);
                    break;
                }
                case 'onError': {
                    if (!data.value) {
                        return;
                    }
                    vscode.window.showErrorMessage(data.value);
                    break;
                }
            }
        });
    }

    public revive(panel: vscode.WebviewView) {
        this._view = panel;
    }

    private _getHtmlForWebview(webview: vscode.Webview) {
        // Use a nonce to only allow specific scripts to be run
        const nonce = getNonce();

        return `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Antigravity Side Manager</title>
                <style>
                    body {
                        font-family: var(--vscode-font-family);
                        padding: 10px;
                        color: var(--vscode-foreground);
                        background-color: var(--vscode-editor-background);
                    }
                    .container {
                        display: flex;
                        flex-direction: column;
                        gap: 10px;
                    }
                    h2 {
                        margin-top: 0;
                        font-size: 1.2em;
                        border-bottom: 1px solid var(--vscode-panel-border);
                        padding-bottom: 5px;
                    }
                    .card {
                        background: var(--vscode-editor-background);
                        border: 1px solid var(--vscode-widget-border);
                        padding: 10px;
                        border-radius: 4px;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    }
                    button {
                        background: var(--vscode-button-background);
                        color: var(--vscode-button-foreground);
                        border: none;
                        padding: 8px 12px;
                        border-radius: 2px;
                        cursor: pointer;
                        width: 100%;
                        margin-bottom: 5px;
                    }
                    button:hover {
                        background: var(--vscode-button-hoverBackground);
                    }
                    .status-badge {
                        display: inline-block;
                        padding: 2px 6px;
                        border-radius: 3px;
                        font-size: 0.8em;
                        font-weight: bold;
                        background: #28a745;
                        color: white;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h2>🚀 Antigravity Manager</h2>
                    
                    <div class="card">
                        <h3>Workspace Control</h3>
                        <p>Status: <span class="status-badge">Active</span></p>
                        <button id="btn-hello">👋 Say Hello</button>
                        <button id="btn-status">🔍 Check Status</button>
                    </div>

                    <div class="card">
                        <h3>Multi-Agent</h3>
                        <div>Active Agents: <strong>1</strong></div>
                        <br>
                        <button id="btn-new-window">➕ Open New Window</button>
                    </div>
                </div>

                <script nonce="${nonce}">
                    const vscode = acquireVsCodeApi();
                    
                    document.getElementById('btn-hello').addEventListener('click', () => {
                        vscode.postMessage({ type: 'onInfo', value: 'Hello from Side Manager!' });
                    });

                    document.getElementById('btn-status').addEventListener('click', () => {
                         vscode.postMessage({ type: 'onInfo', value: 'All systems operational.' });
                    });

                    document.getElementById('btn-new-window').addEventListener('click', () => {
                        // In a real scenario, this would trigger a command to open a new window
                        vscode.postMessage({ type: 'onInfo', value: 'Opening new window (simulated)...' });
                    });
                </script>
            </body>
            </html>`;
    }
}

function getNonce() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
