# Antigravity Auto-Accept Extension

An extension that automatically handles approval procedures within **Antigravity (Google Internal IDE)**.
It automatically executes internal approval commands such as `antigravity.command.accept` every 500ms, eliminating the need for tedious manual clicks.

## ✨ Key Features

- **Full Auto-Approval**: Automatically accepts terminal commands, agent step transitions, and other approval prompts.
- **Toggle Feature**: Click the `AutoAccept` icon in the status bar to toggle the feature on or off at any time.
- **Status Check**: Intuitively check if the auto-accept feature is currently enabled.
- **Quick Accept**: Manually trigger an acceptance with `Ctrl+Shift+Y` if needed.

## 📦 Installation

This extension is specific to Antigravity and must be installed manually via a VSIX file.

1. Download or build the `auto-accept-0.4.0.vsix` file.
2. Open the **Extensions Panel** (`Ctrl+Shift+X`) in Antigravity.
3. Click the `...` (More Actions) menu at the top -> Select **Install from VSIX...**.
4. Select the `.vsix` file to install.
5. Restart Antigravity with **Reload Window** (`Ctrl+Shift+P` -> `Reload Window`).

## 🛠 Build Instructions

To modify the source code and build it yourself:

```bash
npm install
npm run compile
npx @vscode/vsce package
```

## ⚙️ Settings

| Setting | Default | Description |
|---------|---------|-------------|
| `autoAccept.enabled` | `true` | Enable/Disable auto-accept feature |
| `autoAccept.patterns` | `[...]` | (Legacy) List of regex patterns (Not used in current version as it calls internal commands directly) |

---

# Antigravity 자동 수락 확장 프로그램 (Korean)

**Antigravity (Google Internal IDE)** 내에서 발생하는 승인 절차를 자동으로 수행해주는 확장 프로그램입니다.
500ms 주기로 `antigravity.command.accept` 등의 내부 승인 명령어를 자동으로 실행하여 번거로운 클릭을 없애줍니다.

## ✨ 주요 기능

- **완전 자동 승인**: 터미널 명령어, 에이전트 단계 전환, 기타 승인 프롬프트를 자동으로 수락합니다.
- **Toggle 기능**: 상태 표시줄의 `AutoAccept` 아이콘을 클릭하여 언제든지 기능을 켜고 끌 수 있습니다.
- **Status 확인**: 현재 자동 승인 기능이 켜져 있는지 직관적으로 확인할 수 있습니다.
- **Quick Accept (수동 승인)**: 필요시 `Ctrl+Shift+Y` 단축키로 즉시 승인(y 전송)을 수행할 수 있습니다.

## 📦 설치 방법

이 확장 프로그램은 Antigravity 전용이며, VSIX 파일로 수동 설치해야 합니다.

1. `auto-accept-0.4.0.vsix` 파일을 다운로드하거나 빌드합니다.
2. Antigravity에서 **Extensions 패널** (`Ctrl+Shift+X`)을 엽니다.
3. 상단 `...` (More Actions) 메뉴 클릭 -> **Install from VSIX...** 선택.
4. `.vsix` 파일을 선택하여 설치합니다.
5. **Reload Window** (`Ctrl+Shift+P` -> `Reload Window`)로 Antigravity를 재시작합니다.

## 🛠 빌드 방법

소스코드를 직접 수정하고 빌드하려면:

```bash
npm install
npm run compile
npx @vscode/vsce package
```

## ⚙️ 설정

| Setting | Default | Description |
|---------|---------|-------------|
| `autoAccept.enabled` | `true` | 자동 승인 기능 활성화 여부 |
| `autoAccept.patterns` | `[...]` | (Legacy) 정규식 패턴 리스트 (현재 버전에서는 내부 명령어를 직접 호출하므로 사용되지 않음) |

## 📝 Release Notes

### 0.4.0
- **완전 자동화**: Antigravity 내부 명령어(`antigravity.command.accept` 등)를 주기적으로 호출하는 방식으로 변경하여 100% 자동 승인 구현.
