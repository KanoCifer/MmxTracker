# MmxTracker

Browser extension (WXT + React + TypeScript) for **MiniMax Token Plan** users to view usage, plan limits, and token consumption.

## Data source

- Usage / limits / token-burn data comes from `https://platform.minimaxi.com`.
- `wxt.config.ts` **must** declare `manifest.host_permissions: ['https://platform.minimaxi.com/*']` — never drop it, the fetch breaks without it. (Currently missing — add it.)
- Auth method and exact endpoint are TBD; isolate all network calls in a fetch module the background/content scripts call, not inline in UI components.

## Three surfaces

| Surface | Entrypoint | Role |
| --- | --- | --- |
| Popup | `src/entrypoints/popup/` | Quick glance: current usage vs limit. |
| Options | `src/entrypoints/options/` (add `options/index.html`) | Settings: API credentials, refresh interval, alert thresholds. |
| Floating window | content script on `<all_urls>` | Always-present widget showing live token burn. |

## WXT conventions — not plain web

- Alias `@` → `src`.
- **Storage**: `storage.defineItem<...>('local:key', { fallback })` from `wxt/storage`. Use the `local:` / `sync:` / `session:` prefix; never read `chrome.storage` raw.
- **Floating widget**: inside `defineContentScript({ matches: ['<all_urls>'] })`, use `createShadowRootUi(ctx, { ..., cssInjectionMode: 'ui' })` and mount React into a wrapper `<div>` inside the shadow container — never attach a React root to `<body>` directly. Prefer `position: 'overlay'` (or `inline` + fixed CSS) for a floating window.
- **Messaging**: `wxt.sendMessage(...)` from any context; handle in `defineBackground`.
- Entrypoints are file-based: a file/dir name like `options/index.html` auto-registers an options page.

## Commands

`pnpm dev` (HMR) · `pnpm build` · `pnpm zip` · `pnpm compile` (tsc --noEmit). See `package.json`.

## References

WXT docs: https://wxt.dev
