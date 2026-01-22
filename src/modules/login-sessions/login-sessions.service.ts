import { Injectable } from '@nestjs/common';
import { LoginSession, LoginSessionDocument } from './schemas/login-session.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class LoginSessionsService {
  constructor(
    @InjectModel(LoginSession.name)
    private readonly model: Model<LoginSessionDocument>,
  ) {}

  async createSession(data: {
    userId: string;
    accessToken: string;
    expiredAt: Date;
    ipAddress?: string;
    userAgent?: string;
  }) {
    return this.model.create({
      ...data,
      isActive: true,
    });
  }
}
