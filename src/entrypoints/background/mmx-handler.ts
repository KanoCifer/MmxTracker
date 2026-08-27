import { registerUsageRpc } from '@/rpc/usage-rpc';
import { registerRemainRpc } from '@/rpc/remain-rpc';

export function registerMmxHandler() {
  registerUsageRpc();
  registerRemainRpc();
}
