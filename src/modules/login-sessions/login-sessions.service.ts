import { Injectable } from '@nestjs/common';
import { CreateLoginSessionDto } from './dto/create-login-session.dto';
import { UpdateLoginSessionDto } from './dto/update-login-session.dto';
import { InjectModel } from '@nestjs/mongoose';
import { LoginSession, LoginSessionDocument } from './schemas/login-session.schema';
import { Model } from 'mongoose';

@Injectable()
export class LoginSessionsService {
  constructor(
    @InjectModel(LoginSession.name)
    private readonly model: Model<LoginSessionDocument>,
  ) {}

  create(createLoginSessionDto: CreateLoginSessionDto) {
    return 'This action adds a new loginSession';
  }

  findAll() {
    return `This action returns all loginSessions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} loginSession`;
  }

  update(id: number, updateLoginSessionDto: UpdateLoginSessionDto) {
    return `This action updates a #${id} loginSession`;
  }

  remove(id: number) {
    return `This action removes a #${id} loginSession`;
  }

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
