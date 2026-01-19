import { Injectable } from '@nestjs/common';
import { CreateLoginSessionDto } from './dto/create-login-session.dto';
import { UpdateLoginSessionDto } from './dto/update-login-session.dto';

@Injectable()
export class LoginSessionsService {
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
}
