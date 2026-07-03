import { Global, Module } from '@nestjs/common';

import { AuthModule } from '~/core/auth';
import { PrismaModule } from '~/core/prisma';
import { RedisModule } from '~/core/redis';

import { SubscriptionsResolver } from './graphql';
import { SubscriptionsRepository } from './repository';
import { SubscriptionsService } from './services';

@Global()
@Module({
  imports: [AuthModule, PrismaModule, RedisModule],
  providers: [
    SubscriptionsResolver,
    SubscriptionsService,
    SubscriptionsRepository,
  ],
})
export class SubscriptionsModule {}
