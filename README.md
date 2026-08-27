# MmxTracker

浏览器扩展（WXT + React + TypeScript），为 **MiniMax Token Plan** 用户在任何网站上实时显示 token 消耗、计划上限与剩余量——不必切到 platform.minimaxi.com 后台。

## 特性

- **常驻悬浮窗**：在 `<all_urls>` 上挂一个低打扰的 mascot 烧卡，默认收起显示当前 5h 窗口消耗百分比，点击展开为实时 token 烧卡。
- **配色分级预警**：用量超阈值时颜色从 mint → amber → ember → red 递增，一眼感知风险。
- **Popup 总览**：累计消耗、5h 周期配额（按模型）、周配额等。
- **复用网页登录态**：装完即用，无需手动填凭据。

## 开发

```bash
pnpm install        # 安装依赖
pnpm dev            # Chrome HMR 开发
pnpm dev:firefox    # Firefox 开发
pnpm build          # 构建 Chrome
pnpm build:firefox  # 构建 Firefox
pnpm compile        # tsc --noEmit 类型检查
```

## 项目结构

| 表面 | 入口 | 角色 |
| --- | --- | --- |
| Popup | `src/entrypoints/popup/` | 快速总览 |
| 浮动窗 | `src/entrypoints/content.tsx` + `src/components/widget/` | 常驻烧卡组件 |
| Options | `src/entrypoints/options/`（待建） | 设置页 |

## 架构约定

- 别名 `@` → `src`。
- 存储：`storage.defineItem('local:key', { fallback })`（来自 WXT 自动导入的 `storage`），不直接读 `chrome.storage`。
- 浮动组件：在 `defineContentScript` 内用 `createShadowRootUi` + shadow DOM 挂载 React，不直挂 `<body>`。
- 网络调用：隔离在 `src/api/`，背景/内容脚本经 RPC（`src/rpc/`）调用，不内联在 UI。
- `manifest.host_permissions` 必须含 `https://platform.minimaxi.com/*` 与 `https://www.minimaxi.com/*`，否则 fetch 会断。

## 发布

打 `v*` 标签并 push 即可触发 GitHub Actions 自动发布：

```bash
git tag v0.1.0
git push origin v0.1.0
```

`.github/workflows/release.yml` 会构建 Chrome 与 Firefox 压缩包，并在 Release 中附带 `generate_release_notes` 自动生成的更新说明。

## 数据来源

使用量、配额与 token 消耗数据来自 `https://platform.minimaxi.com`（复用网页登录态）。
