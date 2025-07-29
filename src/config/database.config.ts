import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  url: process.env.MONGODB_URI || 'mongodb://localhost:27017/pt-balance',
  databaseName: process.env.MONGODB_DATABASE_NAME || 'pt-balance',
}));
