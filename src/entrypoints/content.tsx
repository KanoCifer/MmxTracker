import { FloatWidget } from '@/components/FloatWidget';
import '@/styles/global.css';
import { createRoot } from 'react-dom/client';

export default defineContentScript({
  matches: ['<all_urls>'],
  cssInjectionMode: 'ui',
  runAt: 'document_idle',

  async main(ctx) {
    const ui = await createShadowRootUi(ctx, {
      name: 'mmxtracker-widget',

      position: 'overlay',
      zIndex: 2147483647,
      anchor: 'body',
      append: 'after',

      onMount(container, _, shadowHost) {
        if (shadowHost) {
          shadowHost.style.position = 'fixed';
          shadowHost.style.zIndex = '2147483647';
          shadowHost.style.top = '0';
          shadowHost.style.left = '0';
          shadowHost.style.width = '0';
          shadowHost.style.height = '0';
          shadowHost.style.overflow = 'visible';
          shadowHost.style.pointerEvents = 'none';
        }
        const app = document.createElement('div');

        app.style.pointerEvents = 'auto';
        container.append(app);
        const root = createRoot(app);
        root.render(<FloatWidget />);
        return root;
      },
      onRemove(root) {
        root?.unmount();
      },
    });

    ui.mount();
    ctx.onInvalidated(() => ui.remove());
  },
});
