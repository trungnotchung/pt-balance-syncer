import { createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';

import { ethereumConfig } from 'src/config';

export const viemClient = createPublicClient({
  chain: mainnet,
  transport: http(ethereumConfig().rpcUrl),
});
