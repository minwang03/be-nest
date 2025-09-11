import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from './schemas/user.schema';
import { BadRequestException } from '@nestjs/common/exceptions';
import { hashPasswordHelper } from '../../helper/util';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  isEmailExist = async (email: string) => {
    const user = await this.userModel.exists({ email });
    if (user) return true;
    return false;
  };

  async create(createUserDto: CreateUserDto) {
    const { username, email, password, phone } = createUserDto;

    // Check email
    const isExist = await this.isEmailExist(email);
    if (isExist) {
      throw new BadRequestException(
        `Email đã tồn tại: ${email}. Vui lòng sử dụng email khác.`,
      );
    }

    // Hash password
    const hashPassword = await hashPasswordHelper(password);

    // Create data user
    const user = await this.userModel.create({
      username,
      email,
      password: hashPassword,
      phone,
    });

    return {
      _id: user._id,
    };
  }

  async findAll() {
    return await this.userModel.find().select('-password');
  }

  async findOne(id: string) {
    return await this.userModel.findById(id).select('-password');
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return await this.userModel.updateOne(
      { _id: new Types.ObjectId(id) },
      { $set: updateUserDto },
    );
  }

  async remove(id: string) {
    return await this.userModel.findByIdAndDelete(id);
  }
}
