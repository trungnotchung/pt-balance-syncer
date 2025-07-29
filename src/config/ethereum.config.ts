import { registerAs } from '@nestjs/config';

export default registerAs('ethereum', () => ({
  rpcUrl: process.env.ETH_RPC_URL || 'https://eth.llamarpc.com',
}));
