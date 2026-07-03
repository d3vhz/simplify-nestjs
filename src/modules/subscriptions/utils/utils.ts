import { createHash } from 'node:crypto';

import { Prisma } from '~/core/prisma';
import { buildCursorCondition } from '~/shared/lib';

import { SortBy } from '../config';
import { IFindAllOptions } from '../types';

const orderByMap = {
  [SortBy.createdAt]: 'createdAt',
  [SortBy.title]: 'title',
  [SortBy.price]: 'price',
};

const buildOrderBy = (
  sortBy: SortBy,
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
