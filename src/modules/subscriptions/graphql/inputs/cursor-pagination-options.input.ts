import { Field, InputType, Int } from '@nestjs/graphql';

import {
  SubscriptionPaymentInterval,
  SubscriptionSortBy,
  SubscriptionStatus,
} from '../../enums';

@InputType()
export class CursorPaginationOptionsInput {
  @Field(() => Int, { nullable: true })
  limit?: number;

  @Field(() => String, { nullable: true })
  after?: string;

  @Field(() => String, { nullable: true })
  sortOrder?: 'asc' | 'desc';

  @Field(() => String, { nullable: true })
  search?: string;

  @Field(() => SubscriptionSortBy, { nullable: true })
  sortBy?: SubscriptionSortBy;

  @Field(() => SubscriptionPaymentInterval, { nullable: true })
  paymentInterval?: SubscriptionPaymentInterval;

  @Field(() => SubscriptionStatus, { nullable: true })
  status?: SubscriptionStatus;
}
