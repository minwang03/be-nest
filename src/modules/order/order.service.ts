import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto, OrderStatus } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './schemas/order.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { OrderDetail } from '../order-detail/schemas/order-detail.schema';
import { IpProxy } from '../ip-proxy/schemas/ip-proxy.schema';
import { PackageProxy } from '../package-proxy/schemas/package-proxy.schema';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name)
    private orderModel: Model<Order>,
    @InjectModel(OrderDetail.name)
    private orderDetailModel: Model<OrderDetail>,
    @InjectModel(IpProxy.name)
    private ipProxyModel: Model<IpProxy>,
    @InjectModel(PackageProxy.name)
    private packageProxyModel: Model<PackageProxy>,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    const { user, packageProxy, quantity, status, detailTemplate, location } =
      createOrderDto;

    // lấy package
    const pkg = await this.packageProxyModel.findById(packageProxy).exec();
    if (!pkg) throw new BadRequestException('Package không tồn tại');

    // tính tổng tiền (server side)
    const sumcost = pkg.cost * quantity;

    // tạo order và lưu template
    const order = await this.orderModel.create({
      user: new Types.ObjectId(user),
      packageProxy: new Types.ObjectId(packageProxy),
      location: new Types.ObjectId(location),
      quantity,
      sumcost,
      status: status || OrderStatus.PENDING,
      detailTemplate,
    });

    return { _id: order._id, status: order.status, sumcost, quantity };
  }

  async updateStatus(id: string, status: OrderStatus) {
    const order = await this.orderModel.findById(id).exec();
    if (!order) throw new NotFoundException(`Order ${id} not found`);

    // đổi trang thái thành đã trả (paid)
    if (status === OrderStatus.PAID && order.status !== OrderStatus.PAID) {
      // lấy package để lấy giá
      const pkg = await this.packageProxyModel
        .findById(order.packageProxy)
        .exec();
      if (!pkg) throw new BadRequestException('Package không tồn tại');

      // lấy IP available
      const ips = await this.ipProxyModel
        .find({
          packageProxy: order.packageProxy,
          isActive: false,
          location: order.location,
        })
        .limit(order.quantity);

      if (ips.length < order.quantity) {
        throw new BadRequestException('Không đủ IP khả dụng');
      }

      const template = order.detailTemplate || {};
      const details = ips.map((ip) => ({
        order: order._id,
        ipProxy: ip._id,
        protocol: template.protocol,
        autochangeIP: !!template.autochangeIP,
        proxysecurity: template.proxysecurity,
        allowedIP: template.allowedIP,
        allowedUser: template.allowedUser,
        allowedPass: template.allowedPass,
        autoextent: !!template.autoextent,
        note: template.note,
        cost: pkg.cost,
        sumcost: pkg.cost,
        expiry_date: pkg.expiry,
      }));

      // insert details
      await this.orderDetailModel.insertMany(details);

      // đánh dấu tránh cấp trùng
      const ipIds = ips.map((i) => i._id);
      await this.ipProxyModel.updateMany(
        { _id: { $in: ipIds } },
        { $set: { isActive: true, assignedOrder: order._id } },
      );
    }

    order.status = status;
    await order.save();
    return order;
  }

  async findAll() {
    return await this.orderModel.find().exec();
  }

  findOne(id: string) {
    return `This action returns a #${id} order`;
  }

  update(id: string, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: string) {
    return `This action removes a #${id} order`;
  }
}
