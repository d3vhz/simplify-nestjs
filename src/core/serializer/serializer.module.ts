import { Global, Module } from '@nestjs/common';

import { SerializerService } from './services';

@Global()
@Module({
  providers: [SerializerService],
  exports: [SerializerService],
})
export class SerializerModule {}
