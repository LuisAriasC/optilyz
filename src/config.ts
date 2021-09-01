import Joi from '@hapi/joi';

import { loadConfig } from './lib/load-config';

export const schema = Joi.object()
 .keys({
      NODE_ENV: Joi.string()
       .valid('development', 'test', 'production')
       .default('development'),
      PORT: Joi.number().port().default(3000),
      MONGO_URL: Joi.string().default('mongodb://localhost:27017/optilyz'),
      JWT_ACCESS_SECRET: Joi.string().default('123456'),
      JWT_REFRESH_SECRET: Joi.string().default('123456')
 })
 .unknown();

const env = loadConfig(schema);

export const config = { 
   env: env.NODE_ENV as 'development' | 'test' | 'production',
   port: env.PORT as number,
   mongoUrl: env.MONGO_URL as string,
   jwtAccessSecret: env.JWT_ACCESS_SECRET as string,
   jwtRefreshSercret: env.JWT_REFRESH_SECRET as string,
};
