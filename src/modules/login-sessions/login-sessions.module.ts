import { Module } from '@nestjs/common';
import { LoginSessionsService } from './login-sessions.service';
import { LoginSessionsController } from './login-sessions.controller';

@Module({
  controllers: [LoginSessionsController],
  providers: [LoginSessionsService],
})
export class LoginSessionsModule {}
