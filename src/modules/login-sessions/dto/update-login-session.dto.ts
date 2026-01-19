import { PartialType } from '@nestjs/mapped-types';
import { CreateLoginSessionDto } from './create-login-session.dto';

export class UpdateLoginSessionDto extends PartialType(CreateLoginSessionDto) {}
