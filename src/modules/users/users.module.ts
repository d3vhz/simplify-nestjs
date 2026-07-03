import { Global, Module } from '@nestjs/common';

import { AuthModule } from '~/core/auth';
import { PrismaModule } from '~/core/prisma';
import { RedisModule } from '~/core/redis';

import { UsersResolver } from './graphql';
import { UsersRepository } from './repository';
import { UsersService } from './services';

@Global()
@Module({
  imports: [AuthModule, PrismaModule, RedisModule],
  providers: [UsersResolver, UsersService, UsersRepository],
})
export class UsersModule {}
