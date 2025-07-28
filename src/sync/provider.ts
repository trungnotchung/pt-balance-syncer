import { createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';

import env from 'src/config';

export const viemClient = createPublicClient({
  chain: mainnet,
  transport: http(env.eth.rpcUrl),
});
