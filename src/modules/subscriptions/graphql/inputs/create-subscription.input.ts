import { Field, InputType } from '@nestjs/graphql';
import { createZodDto } from 'nestjs-zod';

import { SubscriptionPaymentInterval, SubscriptionStatus } from '../../enums';
import { CreateSubscriptionSchema } from '../../schemas';

@InputType()
export class CreateSubscriptionInput extends createZodDto(
  CreateSubscriptionSchema
) {
  @Field({ nullable: true })
  imgUrl?: string;

  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  price: number;

  @Field(() => SubscriptionPaymentInterval)
  paymentInterval: SubscriptionPaymentInterval;

  @Field()
  paymentDate: Date;

  @Field(() => SubscriptionStatus)
  status: SubscriptionStatus;
}
