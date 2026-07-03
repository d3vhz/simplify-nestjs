import { Global, Module } from '@nestjs/common';

import { AuthModule } from '~/core/auth';
import { PrismaModule } from '~/core/prisma';
import { RedisModule } from '~/core/redis';

import { UsersResolver } from './graphql';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

@Global()
@Module({
  imports: [AuthModule, PrismaModule, RedisModule],
  providers: [UsersResolver, UsersService, UsersRepository],
})
export class UsersModule {}
