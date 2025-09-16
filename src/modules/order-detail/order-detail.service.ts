import { Injectable } from '@nestjs/common';
import { CreateOrderDetailDto } from '@/modules/order-detail/dto/create-order-detail.dto';
import { UpdateOrderDetailDto } from './dto/update-order-detail.dto';
import { InjectModel } from '@nestjs/mongoose';
import { OrderDetail } from './schemas/order-detail.schema';
import { Model } from 'mongoose';

@Injectable()
export class OrderDetailService {
  constructor(
    @InjectModel(OrderDetail.name)
    private orderDetailModel: Model<OrderDetail>,
  ) {}

  create(createOrderDetailDto: CreateOrderDetailDto) {
    return 'This action adds a new orderDetail';
  }

  async findAll() {
    return await this.orderDetailModel.find().exec();
  }

  findOne(id: number) {
    return `This action returns a #${id} orderDetail`;
  }

  update(id: number, updateOrderDetailDto: UpdateOrderDetailDto) {
    return `This action updates a #${id} orderDetail`;
  }

  remove(id: number) {
    return `This action removes a #${id} orderDetail`;
  }
}
