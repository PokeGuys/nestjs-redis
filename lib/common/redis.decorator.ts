import { Inject } from '@nestjs/common';
import { getClientToken } from './redis.util';

export const InjectRedis: (name?: string) => ParameterDecorator = (name?: string) =>
  Inject(getClientToken(name));
