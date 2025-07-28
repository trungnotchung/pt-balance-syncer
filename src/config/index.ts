import { config } from 'dotenv';

config();

function loadConfig() {
	return {
		port: process.env.PORT || 3000,
		db: {
			url: process.env.DB_URL || 'mongodb://localhost:27017/pt-balance',
		},
		eth: {
			rpcUrl: process.env.ETH_RPC_URL || 'wss://ethereum-rpc.publicnode.com',
		},
		contracts: {
			pt: {
				address: process.env.PT_ADDRESS || '',
			}
		}
	}
}

const env = loadConfig();

export default env;