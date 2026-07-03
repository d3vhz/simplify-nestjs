import { Module } from '@nestjs/common';

import { GqlAuthGuard } from './guards';
import { AuthService } from './services';

@Module({
  providers: [GqlAuthGuard, AuthService],
  exports: [GqlAuthGuard, AuthService],
})
export class AuthModule {}
