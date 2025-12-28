import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '@/modules/users/dto/create-user.dto';
import { UpdateUserDto } from '@/modules/users/dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from '@/modules/users/schemas/user.schema';
import { BadRequestException } from '@nestjs/common/exceptions';
import { hashPasswordHelper } from '@/helper/util';
import { CreateAuthDto } from '@/auth/dto/create-auth.dto';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import { MailService } from '@/mail/mail.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly mailService: MailService,
  ) {}

  async findInfo(id: string) {
    return await this.userModel.findById(id).select('-password').lean();
  }

  async findByEmail(email: string) {
    return await this.userModel.findOne({ email });
  }

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
    return await this.userModel.find().select('-password').exec();
  }

  async findOne(id: string) {
    return await this.userModel.findById(id).select('-password').exec();
  }

  async findBalanceOne(id: string) {
    const user = await this.userModel.findById(id).select('balance').lean();
    return { balance: user?.balance ?? 0 };
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return await this.userModel.updateOne(
      { _id: new Types.ObjectId(id) },
      { $set: updateUserDto },
    );
  }

  async remove(id: string) {
    return await this.userModel.findByIdAndDelete(id).exec();
  }

  async handleRegister(registerDto: CreateAuthDto) {
    const { username, email, password } = registerDto;

    //check email
    const isExist = await this.isEmailExist(email);
    if (isExist === true) {
      throw new BadRequestException(
        `Email đã tồn tại: ${email}. Vui lòng sử dụng email khác.`,
      );
    }

    //hash password
    const hashPassword = await hashPasswordHelper(password);

    //create data user
    const user = await this.userModel.create({
      username,
      email,
      password: hashPassword,
      isActive: false,
      codeId: uuidv4(),
      codeExpired: dayjs().add(15, 'minutes'),
    });

    //send email
    // if (!user.codeId) {
    //   throw new Error('CodeId không tồn tại');
    // }
    // await this.mailService.sendActivationEmail(email, user.codeId);

    return {
      message:
        'Đăng ký thành công. Vui lòng kiểm tra email để kích hoạt tài khoản.',
    };
  }

  async activateAccount(codeId: string) {
    const user = await this.userModel.findOne({ codeId });

    if (!user) {
      throw new BadRequestException('Code không hợp lệ');
    }

    if (user.codeExpired < new Date()) {
      throw new BadRequestException('Code đã hết hạn');
    }

    user.isActive = true;
    user.codeId = null;
    await user.save();

    return {
      message: 'Tài khoản đã được kích hoạt!',
      _id: user._id,
    };
  }
}
