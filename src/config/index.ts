import { config } from 'dotenv';

config();

function loadConfig() {
  return {
    port: process.env.PORT || 3000,
    db: {
      url: process.env.MONGODB_URI || 'mongodb://localhost:27017/pt-balance',
    },
    eth: {
      rpcUrl: process.env.ETH_RPC_URL || 'https://eth.llamarpc.com',
    },
    contracts: {
      pt: {
        address:
          process.env.PT_ADDRESS ||
          '0x0000000000000000000000000000000000000000',
        deployedBlock: process.env.PT_DEPLOYED_BLOCK || 0,
      },
    },
    jwt: {
      secret: process.env.JWT_SECRET,
      audience: process.env.JWT_TOKEN_AUDIENCE,
      issuer: process.env.JWT_TOKEN_ISSUER,
      accessTokenTtl: parseInt(process.env.JWT_ACCESS_TOKEN_TTL ?? '3600', 10),
    },
  };
}

const env = loadConfig();

export default env;
