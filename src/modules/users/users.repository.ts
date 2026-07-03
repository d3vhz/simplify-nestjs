import { Injectable } from '@nestjs/common';

import { Prisma, PrismaService } from '~/core/prisma';
import { RedisService } from '~/core/redis';

import { UserCacheKeys, UserTtl } from './config';

@Injectable()
export class UsersRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService
  ) {}

  findById(id: string) {
    return this.redis.remember(UserCacheKeys.one(id), UserTtl.USER, () =>
      this.prisma.users.findUnique({
        where: { id },
      })
    );
  }

  async create(data: Prisma.UsersCreateInput) {
    const user = await this.prisma.users.create({
      data,
    });

    await this.invalidateCache(user.id);

    return user;
  }

  async update(
    id: string,
    data: Pick<Prisma.UsersUpdateInput, 'firstName' | 'lastName' | 'avatarUrl'>
  ) {
    const user = await this.prisma.users.update({
      where: { id },
      data,
    });

    await this.invalidateCache(user.id);

    return user;
  }

  async delete(id: string) {
    const user = await this.prisma.users.delete({
      where: { id },
    });

    await this.invalidateCache(user.id);

    return user;
  }

  invalidateCache(id: string) {
    return this.redis.del(UserCacheKeys.one(id));
  }
}
