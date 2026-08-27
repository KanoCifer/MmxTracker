import { FloatWidget } from '@/components/widget/FloatWidget';
import '@/styles/global.css';
import { createRoot } from 'react-dom/client';

export default defineContentScript({
  matches: ['<all_urls>'],
  cssInjectionMode: 'ui',

  async main(ctx) {
    const ui = await createShadowRootUi(ctx, {
      name: 'mmx-widget',
      position: 'inline',
      anchor: 'body',
      append: 'last',
      onMount(container) {
        const root = createRoot(container);
        root.render(<FloatWidget />);
        return root;
      },
      onRemove(root) {
        root?.unmount();
      },
    });

    ui.mount();

    // === 1. 强制取到 host,不依赖 WXT 返回值 ===
    const host = ui.shadowHost ?? (document.querySelector('mmx-widget') as HTMLElement | null);

    if (!host) {
      console.error('[mmx] shadowHost not found');
      return;
    }

    // === 2. 强制设置定位与层级,覆盖一切 WXT 行为 ===
    Object.assign(host.style, {
      position: 'fixed',
      zIndex: '2147483647',
      inset: '0',
      width: '100%',
      height: '100%',
      margin: '0',
      border: 'none',
      padding: '0',
      background: 'transparent',
      pointerEvents: 'none',
      display: 'block',
      overflow: 'visible',
    });

    // === 3. 重新插到 body 末尾,保证 DOM 顺序占优 ===
    document.body.appendChild(host);

    // === 4. 内部容器恢复交互 ===
    const inner = host.shadowRoot?.querySelector(':scope > *') as HTMLElement | null;
    if (inner) {
      Object.assign(inner.style, {
        pointerEvents: 'auto',
        position: 'fixed',
        inset: '0',
      });
    }

    // === 5. 进 Top Layer,赢过一切 dialog / popover ===
    if ('popover' in host) {
      host.setAttribute('popover', 'manual');
      host.showPopover();
    }

    ctx.onInvalidated(() => {
      host.hidePopover?.();
      ui.remove();
    });
  },
});
