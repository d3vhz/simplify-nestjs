import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';

import { AuthModule } from '~/core/auth';
import { GraphQLModule } from '~/core/graphql';
import { PrismaModule } from '~/core/prisma';
import { RedisModule } from '~/core/redis';
import { SerializerModule } from '~/core/serializer';
import { SupabaseModule } from '~/core/supabase';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local'],
      validationSchema: null, // We use Zod for validation
    }),
    AuthModule,
    PrismaModule,
    RedisModule,
    SerializerModule,
    GraphQLModule,
    SupabaseModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
  ],
})
export class AppModule {}
