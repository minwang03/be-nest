import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LoginSessionsService } from './login-sessions.service';
import { CreateLoginSessionDto } from './dto/create-login-session.dto';
import { UpdateLoginSessionDto } from './dto/update-login-session.dto';

@Controller('login-sessions')
export class LoginSessionsController {
  constructor(private readonly loginSessionsService: LoginSessionsService) {}

  @Post()
  create(@Body() createLoginSessionDto: CreateLoginSessionDto) {
    return this.loginSessionsService.create(createLoginSessionDto);
  }

  @Get()
  findAll() {
    return this.loginSessionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.loginSessionsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLoginSessionDto: UpdateLoginSessionDto) {
    return this.loginSessionsService.update(+id, updateLoginSessionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.loginSessionsService.remove(+id);
  }
}
