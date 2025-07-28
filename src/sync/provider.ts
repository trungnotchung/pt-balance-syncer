import env from 'src/config';
import { createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';

export const viemClient = createPublicClient({
  chain: mainnet,
  transport: http(env.eth.rpcUrl),
});
