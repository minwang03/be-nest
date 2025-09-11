import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/modules/users/users.service';
import { comparePasswordHelper } from '../helper/util';
import { JwtService } from '@nestjs/jwt';
import { CreateAuthDto } from './dto/create-auth.dto';

@Injectable()
export class  AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Email không tồn tại');

    const isMatch = await comparePasswordHelper(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Sai mật khẩu');

    return user;
  }

  async login(user: any) {
    const payload = { sub: user._id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  handleRegister = async (registerDto: CreateAuthDto) => {
    return await this.usersService.handleRegister(registerDto);
  };

  async activateAccount(codeId: string) {
    return this.usersService.activateAccount(codeId);
  }
}
