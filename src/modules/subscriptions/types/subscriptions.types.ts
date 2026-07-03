import z from 'zod';

import { IBasePaginationOptions } from '~/shared/types';

import {
  SubscriptionPaymentInterval,
  SubscriptionSortBy,
  SubscriptionStatus,
} from '../enums';
import {
  CreateSubscriptionSchema,
  SubscriptionSchema,
  UpdateSubscriptionSchema,
} from '../schemas';

type CreateSubscription = z.infer<typeof CreateSubscriptionSchema>;

type UpdateSubscription = z.infer<typeof UpdateSubscriptionSchema>;

type Subscription = z.infer<typeof SubscriptionSchema>;

interface IFindAllOptions extends IBasePaginationOptions {
  sortBy?: SubscriptionSortBy;
  paymentInterval?: SubscriptionPaymentInterval | null;
  status?: SubscriptionStatus | null;
}

export type {
  CreateSubscription,
  UpdateSubscription,
  Subscription,
  IFindAllOptions,
};
