import { createHash } from 'node:crypto';

import { Prisma } from '~/core/prisma';
import { buildCursorCondition } from '~/shared/helpers';

import { SubscriptionSortBy } from '../enums';
import { IFindAllOptions } from '../types';

const orderByMap = {
  [SubscriptionSortBy.createdAt]: 'createdAt',
  [SubscriptionSortBy.title]: 'title',
  [SubscriptionSortBy.price]: 'price',
};

const buildOrderBy = (
  sortBy: SubscriptionSortBy,
  sortOrder: Prisma.SortOrder
): Prisma.SubscriptionsOrderByWithRelationInput[] => {
  return [
    {
      [orderByMap[sortBy]]: sortOrder,
    },
    {
      id: sortOrder,
    },
  ];
};

const buildWhere = ({
  userId,
  after,
  sortOrder,
  search,
  paymentInterval,
  status,
}: IFindAllOptions & { userId: string }): Prisma.SubscriptionsWhereInput => {
  return {
    userId,
    ...(after && buildCursorCondition(after, sortOrder)),
    ...(search && {
      title: {
        contains: search,
        mode: 'insensitive',
      },
    }),
    ...(paymentInterval && { paymentInterval }),
    ...(status && { status }),
  };
};

const buildKey = (prefix: string, payload: unknown): string => {
  const hash = createHash('sha256')
    .update(JSON.stringify(payload))
    .digest('hex')
    .slice(0, 16);

  return `${prefix}:${hash}`;
};

export { buildOrderBy, buildWhere, buildKey };
