import { registerMmxHandler } from './mmx-handler';

export default defineBackground({
  type: 'module',
  main() {
    registerMmxHandler();
  },
});
