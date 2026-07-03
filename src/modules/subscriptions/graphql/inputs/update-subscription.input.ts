import { Field, InputType } from '@nestjs/graphql';
import { createZodDto } from 'nestjs-zod';

import { SubscriptionPaymentInterval, SubscriptionStatus } from '../../enums';
import { UpdateSubscriptionSchema } from '../../schemas';

@InputType()
export class UpdateSubscriptionInput extends createZodDto(
  UpdateSubscriptionSchema
) {
  @Field({ nullable: true })
  imgUrl?: string;

  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  price?: number;

  @Field(() => SubscriptionPaymentInterval, { nullable: true })
  paymentInterval?: SubscriptionPaymentInterval;

  @Field({ nullable: true })
  paymentDate?: Date;

  @Field(() => SubscriptionStatus, { nullable: true })
  status?: SubscriptionStatus;
}
