# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

MiniMax Token Plan 用户，两条人群（已确认两者都覆盖）：

- **开发者**：用 API 调模型/编码，长时间跑任务时边干活边担心撞上 5 小时窗口或周配额上限，需要粒度到窗口的剩余量。更关心 current_interval_* / current_weekly_* 这类配额细分。
- **重度 AI 用户**：高频使用 MiniMax 网页端产品，关心自己一共用了多少、还剩多少、是否接近上限。

共同点：都在意 token 消耗与剩余；不希望在干别的时切去平台后台查用量。

## Product Purpose

一个浏览器扩展，让 MiniMax Token Plan 用户在**当前所在的任何网站**上实时看到 token 燃烧、计划上限与使用量，不必切到 platform.minimaxi.com 后台。成功 = 用户在工作流里"瞟一眼"就能感知消耗与剩余，不必专门去查询。

## Positioning

**始终在线的消耗感知。** 悬浮 mascot 常驻在所有站点上实时显示 token 消耗，这是其他竞品替代不了的核心差异化——把"被动去后台查用量"变成"随时瞟一眼"。数据洞察与配额预警是支撑，不是主打。

## Operating Context

- 浏览器扩展，运行于 `<all_urls>`；用户在浏览器里工作（编码、使用 MiniMax 网页产品），不希望被后台打断。
- 数据源为 `https://platform.minimaxi.com`；认证走**复用网页登录态**（已确认：读取用户已登录 minimaxi.com 的会话，装完即用）。因此扩展需能访问 `platform.minimaxi.com/*` 与 `www.minimaxi.com/*`。
- 三个表面：Popup（快速总览）、浮动窗口（常驻烧卡组件）、Options（设置，待建）。
- 一个会话（wxt dev/登录态）的过期与刷新需处理，否则装完即用的体验会断。

## Capabilities and Constraints

已确认的功能：

- Popup：累计消耗、近 14 天消耗 sparkline、5h 周期配额（按模型）、活跃天数/连续天数、使用排行、主力模型。
- 浮动窗口：Content Script on `<all_urls>`，mascot 头像默认收起，点击展开为实时 token 烧卡；用量超阈值时配色分级（mint→amber→ember→red）。
- 数据接口：`/account/token_plan/usage_summary`、`/account/token_plan/remains_percent`（隔离在 `src/api/`，背景/内容脚本经 RPC 调用，不内联在 UI）。

事实与约束：

- WXT 约定：`@`→`src`；存储用 `storage.defineItem`（带 `local:`/`sync:`/`session:` 前缀）；浮动组件用 `createShadowRootUi` + shadow DOM，不用 attach 到 `<body>`；消息用 `wxt.sendMessage`。
- `manifest.host_permissions` **必须**含 `https://platform.minimaxi.com/*`（含 `www.minimaxi.com/*`），缺了 fetch 会断。
- 配额有 5h 间隔窗口（current_interval_*）与周窗口（current_weekly_*）两套；字段计数用 `-1` 表示"不适用/无限"。
- Options 页入口尚未建立（`src/entrypoints/options/`，需 `options/index.html`）。
- 认证方式：**复用网页登录态**（已确认）。具体鉴权头/端点提取方式仍待实现，需隔离在 fetch/request 模块。

## Brand Commitments

- 产品名 **MmxTracker**（已固定）。
- mascot 头像资产存在：`src/assets/mascot.png`。
- 既有"深色 token-burn 计量仪"视觉世界（near-black 画布、ember=已消耗、mint=剩余、等宽数字）——此为现存实现，视觉决策按新工作流处理，不作为本文件扩展记录。

## Evidence on Hand

- 浮动窗口原型：`docs/widget-prototype.html`。
- Popup 与浮动窗口已有可运行实现：`src/entrypoints/popup/`、`src/components/widget/`。
- DA 暂无真实用户数据/测试/案例，后续不得虚构。

## Product Principles

1. **看，而不是查。** 用量应在工作流内自然可见，用户无须离开当前页。
2. **粒度到窗口。** 既给累计，也给 5h/周配额的细分剩余——开发者关心的正是边界。
3. **感知先行，洞察其次。** 实时烧卡与预警优先于统计复盘类功能。
4. **免配置优先。** 复用网页登录态，装完即用，不逼用户手动填凭据。
5. **不打断。** 悬浮组件常驻但低打扰，展开才有细节；配色分级传达风险。

## Accessibility & Inclusion

无已确立的产品级无障碍要求。
