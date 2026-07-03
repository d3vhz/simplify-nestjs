import { Injectable } from '@nestjs/common';

import { Prisma, PrismaService } from '~/core/prisma';
import { RedisService } from '~/core/redis';
import { encodeCursor } from '~/shared/helpers';
import { IBasePaginationResult } from '~/shared/types';

import { SubscriptionCacheKeys } from '../constants';
import { SubscriptionSortBy, SubscriptionTTL } from '../enums';
import { IFindAllOptions } from '../types';

import {
  buildKey,
  buildOrderBy,
  buildWhere,
} from './subscription-repository.helpers';

@Injectable()
export class SubscriptionsRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService
  ) {}

  findAll({
    userId,
    options = {},
  }: {
    userId: string;
    options?: IFindAllOptions;
  }): Promise<IBasePaginationResult<Prisma.SubscriptionsModel>> {
    const cacheKey = buildKey(SubscriptionCacheKeys.list(userId), options);

    const {
      limit = 20,
      after,
      sortOrder = 'desc',
      search = '',
      sortBy = SubscriptionSortBy.createdAt,
      paymentInterval,
      status,
    } = options;

    return this.redis.remember(
      cacheKey,
      SubscriptionTTL.SUBSCRIPTION_LIST,
      async () => {
        const [items, totalCount] = await this.prisma.$transaction([
          this.prisma.subscriptions.findMany({
            where: buildWhere({
              userId,
              after,
              sortOrder,
              search,
              paymentInterval,
              status,
            }),
            orderBy: buildOrderBy(sortBy, sortOrder),
            take: limit + 1,
          }),
          this.prisma.subscriptions.count({
            where: { userId },
          }),
        ]);

        const hasNextPage = items.length > limit;
        const data = hasNextPage ? items.slice(0, limit) : items;

        return {
          data,
          hasNextPage,
          nextCursor: hasNextPage ? encodeCursor(data[data.length - 1]) : null,
          totalCount,
        };
      }
    );
  }

  findById({ userId, id }: { userId: string; id: string }) {
    return this.redis.remember(
      SubscriptionCacheKeys.one({ userId, id }),
      SubscriptionTTL.SUBSCRIPTION,
      () =>
        this.prisma.subscriptions.findUnique({
          where: { userId, id },
        })
    );
  }

  async create({
    userId,
    data,
  }: {
    userId: string;
    data: Omit<Prisma.SubscriptionsCreateInput, 'userId'>;
  }) {
    const subscription = await this.prisma.subscriptions.create({
      data: {
        ...data,
        userId,
      },
    });

    await this.invalidateCache({ userId, invalidateAll: true });

    return subscription;
  }

  async update({
    userId,
    id,
    data,
  }: {
    userId: string;
    id: string;
    data: Omit<Prisma.SubscriptionsUpdateInput, 'userId' | 'id'>;
  }) {
    const subscription = await this.prisma.subscriptions.update({
      where: { userId, id },
      data,
    });

    await this.invalidateCache({ userId, id });

    return subscription;
  }

  async delete({ userId, id }: { userId: string; id: string }) {
    const subscription = await this.prisma.subscriptions.delete({
      where: { userId, id },
    });

    await this.invalidateCache({ userId, id });

    return subscription;
  }

  private invalidateCache({
    userId,
    id,
    invalidateAll,
  }: {
    userId: string;
    id?: string;
    invalidateAll?: boolean;
  }) {
    const operations = [
      this.redis.delByPattern(SubscriptionCacheKeys.listPattern(userId)),
    ];

    if (invalidateAll) {
      operations.push(
        this.redis.delByPattern(SubscriptionCacheKeys.onePattern(userId))
      );
    }

    if (id) {
      operations.push(
        this.redis.del(SubscriptionCacheKeys.one({ userId, id }))
      );
    }

    return Promise.all(operations);
  }
}
