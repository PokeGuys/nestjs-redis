import { Inject } from '@nestjs/common';
import { getClientToken as getClientToken } from './redis.util';

export const InjectRedis: (name?: string) => ParameterDecorator = (name?: string) =>
  Inject(getClientToken(name));
