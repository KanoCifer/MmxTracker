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

| 表面    | 入口                                                     | 角色         |
| ------- | -------------------------------------------------------- | ------------ |
| Popup   | `src/entrypoints/popup/`                                 | 快速总览     |
| 浮动窗  | `src/entrypoints/content.tsx` + `src/components/widget/` | 常驻烧卡组件 |
| Options | `src/entrypoints/options/`（待建）                       | 设置页       |

## 架构约定

- 别名 `@` → `src`。
- 存储：`storage.defineItem('local:key', { fallback })`（来自 WXT 自动导入的 `storage`），不直接读 `chrome.storage`。
- 浮动组件：在 `defineContentScript` 内用 `createShadowRootUi` + shadow DOM 挂载 React，不直挂 `<body>`。
- 网络调用：隔离在 `src/api/`，背景/内容脚本经 RPC（`src/rpc/`）调用，不内联在 UI。
- `manifest.host_permissions` 必须含 `https://platform.minimaxi.com/*` 与 `https://www.minimaxi.com/*`，否则 fetch 会断。

## 安装

从 [Releases](https://github.com/KanoCifer/MmxTracker/releases) 下载对应浏览器的压缩包（`*.zip`），解压后按以下方式加载：

### Chrome / Edge

1. 打开 `chrome://extensions`（Edge 为 `edge://extensions`）。
2. 右上角开启「开发者模式」。
3. 把解压后的扩展文件夹**拖入**扩展页面，即可完成安装。

> 说明：Release 提供的是解压版目录（zip 内为已构建的扩展文件夹）。直接拖入扩展页即可加载，无需打包为 `.crx`。

### Firefox

1. 打开 `about:debugging#/runtime/this-firefox`。
2. 点击「临时载入附加组件」。
3. 选择解压目录中的 `manifest.json`。

> Firefox 临时载入在重启浏览器后失效；正式分发需提交 Firefox Add-ons。

## 数据来源

使用量、配额与 token 消耗数据来自 `https://platform.minimaxi.com`（复用网页登录态）。
