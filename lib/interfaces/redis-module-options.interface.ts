import { ModuleMetadata, Type } from '@nestjs/common';
import { Cluster, ClusterOptions, NodeConfiguration, Redis, RedisOptions } from 'ioredis';

export type RedisClient = Redis | Cluster;

export type RedisClusterModuleOptions = {
  nodes: NodeConfiguration[];
} & Partial<ClusterOptions>;

export type RedisModuleOptions = {
  clientName?: string;
  uri?: string;
  cluster?: RedisClusterModuleOptions;
  connectionFactory?: (connection: any, name: string) => any;
} & Partial<RedisOptions>;

export interface RedisOptionsFactory {
  createRedisOptions(connectionName?: string): Promise<RedisModuleOptions> | RedisModuleOptions;
}

export interface RedisModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  name?: string;
  useExisting?: Type<RedisOptionsFactory>;
  useClass?: Type<RedisOptionsFactory>;
  useFactory?: (...args: any[]) => Promise<RedisModuleOptions> | RedisOptionsFactory;
  inject?: any[];
}
