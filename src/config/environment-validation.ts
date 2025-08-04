import * as Joi from 'joi';

export const environmentValidationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').required(),
  PORT: Joi.number().default(3000),
  MONGODB_URI: Joi.string().required(),
  MONGODB_DATABASE_NAME: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  JWT_TOKEN_AUDIENCE: Joi.string().required(),
  JWT_TOKEN_ISSUER: Joi.string().required(),
  JWT_ACCESS_TOKEN_TTL: Joi.number().required(),
  PT_ADDRESS: Joi.string().required(),
  PT_DEPLOYED_BLOCK: Joi.number().required(),
  ETH_RPC_URL: Joi.string().required(),
});
