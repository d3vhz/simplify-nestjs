import { Global, Module } from '@nestjs/common';

import { SerializerModule } from '../serializer';

import { RedisService } from './services';

@Global()
@Module({
  imports: [SerializerModule],
  exports: [RedisService],
  providers: [RedisService],
})
export class RedisModule {}
