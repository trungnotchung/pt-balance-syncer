import { config } from 'dotenv';

config();

function loadConfig() {
	return {
		port: process.env.PORT || 3000,
		db: {
			url: process.env.DB_URL || 'mongodb://localhost:27017/pt-balance',
		}
	}
}

const env = loadConfig();

export default env;