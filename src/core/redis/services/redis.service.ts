import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

import { SerializerService } from '../../serializer';
import { RedisTTL } from '../enums';

const NULL_CACHE_VALUE = '__null__';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private readonly client: Redis;

  constructor(
    private readonly configService: ConfigService,
    private readonly serializer: SerializerService
  ) {
    this.client = new Redis(this.configService.getOrThrow('REDIS_URL'), {
      lazyConnect: true,
      maxRetriesPerRequest: 3,
    });

    this.client.on('error', (error) => {
      this.logger.error('Redis connection error', error);
    });

    this.client.on('connect', () => this.logger.log('Redis connected'));
  }

  async onModuleInit() {
    await this.client.connect();
  }

  async onModuleDestroy() {
    await this.client.quit();
  }

  async get<T>(key: string): Promise<T | null | undefined> {
    try {
      const value = await this.client.get(key);

      if (value === null) {
        return undefined;
      }

      if (value === NULL_CACHE_VALUE) {
        return null;
      }

      return this.serializer.deserialize(value);
    } catch (error) {
      this.logger.warn(`Cache read failed for key "${key}"`, error);
      return undefined;
    }
  }

  async set(key: string, value: unknown, ttlSeconds: number): Promise<void> {
    try {
      const serialized =
        value === null || value === undefined
          ? NULL_CACHE_VALUE
          : this.serializer.serialize(value);

      await this.client.set(key, serialized, 'EX', ttlSeconds);
    } catch (error) {
      this.logger.warn(`Cache write failed for key "${key}"`, error);
    }
  }

  async del(...keys: string[]): Promise<void> {
    if (keys.length === 0) {
      return;
    }

    try {
      await this.client.del(...keys);
    } catch (error) {
      this.logger.warn(
        `Cache delete failed for keys "${keys.join(', ')}"`,
        error
      );
    }
  }

  async delByPattern(pattern: string): Promise<void> {
    try {
      const stream = this.client.scanStream({ count: 100, match: pattern });

      for await (const keys of stream) {
        const keyBatch = keys as string[];

        if (keyBatch.length > 0) {
          await this.client.del(...keyBatch);
        }
      }
    } catch (error) {
      this.logger.warn(`Cache pattern delete failed for "${pattern}"`, error);
    }
  }

  async remember<T>(
    key: string,
    ttlSeconds: number,
    factory: () => Promise<T>
  ): Promise<T> {
    const cached = await this.get<T>(key);

    if (cached !== undefined) return cached as T;

    const value = await factory();
    const ttl =
      value === null || value === undefined ? RedisTTL.NOT_FOUND : ttlSeconds;

    await this.set(key, value, ttl);

    return value;
  }
}
