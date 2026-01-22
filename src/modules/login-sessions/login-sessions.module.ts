import { Module } from '@nestjs/common';
import { LoginSessionsService } from './login-sessions.service';
import { LoginSessionsController } from './login-sessions.controller';
import { LoginSession, LoginSessionSchema } from './schemas/login-session.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LoginSession.name, schema: LoginSessionSchema },
    ]),
  ],
  controllers: [LoginSessionsController],
  providers: [LoginSessionsService],
  exports: [LoginSessionsService],
})
export class LoginSessionsModule {}
