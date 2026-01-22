import { Injectable } from '@nestjs/common';
import { UsersService } from '@/modules/users/users.service';
import { comparePasswordHelper } from '@/helper/util';
import { JwtService } from '@nestjs/jwt';
import { CreateAuthDto } from '@/auth/dto/create-auth.dto';
import { LoginSession } from '@/modules/login-sessions/schemas/login-session.schema';
import { HydratedDocument, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Request } from 'express';

type LoginSessionDocument = HydratedDocument<LoginSession>;

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectModel(LoginSession.name)
    private loginSessionModel: Model<LoginSessionDocument>,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.usersService.findByEmail(username);
    if (!user) return null;
    const isValidPassword = await comparePasswordHelper(
      password,
      user.password,
    );
    if (!isValidPassword) return null;
    return user;
  }

  async login(user: any, req: Request) {
    const payload = {
      sub: user._id,
      role: user.role,
      username: user.username,
      email: user.email,
      isActive: user.isActive,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
    });

    await this.loginSessionModel.create({
      userId: user._id,
      accessToken,
      expiredAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return { access_token: accessToken };
  }

  handleRegister = async (registerDto: CreateAuthDto) => {
    return await this.usersService.handleRegister(registerDto);
  };

  async activateAccount(codeId: string) {
    return await this.usersService.activateAccount(codeId);
  }
}
