import { Global, Module } from '@nestjs/common';

import { SerializerModule } from '../serializer';

import { RedisService } from './redis.service';

@Global()
@Module({
  imports: [SerializerModule],
  exports: [RedisService],
  providers: [RedisService],
})
export class RedisModule {}
