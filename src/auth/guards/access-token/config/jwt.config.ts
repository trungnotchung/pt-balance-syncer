import { registerAs } from '@nestjs/config';

import env from 'src/config';

export default registerAs('jwt', () => {
  return {
    secret: env.jwt.secret,
    audience: env.jwt.audience,
    issuer: env.jwt.issuer,
    accessTokenTtl: env.jwt.accessTokenTtl,
  };
});
