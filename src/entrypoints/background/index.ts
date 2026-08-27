import { registerBadgeHandler } from './badge';
import { registerUsageRpc } from '@/rpc/usage-rpc';
import { registerRemainRpc } from '@/rpc/remain-rpc';

export default defineBackground({
  type: 'module',
  main() {
    registerUsageRpc();
    registerRemainRpc();
    registerBadgeHandler();
  },
});
