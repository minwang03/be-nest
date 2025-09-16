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

    const pkg = await this.validateAndGetPackage(packageProxy);
    const sumcost = this.calculateTotalCost(pkg.cost, quantity);

    const order = await this.createOrderRecord({
      user,
      packageProxy,
      location,
      quantity,
      sumcost,
      status: status || OrderStatus.PENDING,
      detailTemplate,
    });

    return { _id: order._id, status: order.status, sumcost, quantity };
  }

  async updateStatus(id: string, status: OrderStatus) {
    const order = await this.findOrderById(id);

    if (status === OrderStatus.PAID && order.status !== OrderStatus.PAID) {
      await this.processPaymentStatus(order);
    }

    order.status = status;
    await order.save();
    return order;
  }

  private async validateAndGetPackage(packageProxyId: string) {
    const pkg = await this.packageProxyModel.findById(packageProxyId).exec();
    if (!pkg) {
      throw new BadRequestException('Package không tồn tại');
    }
    return pkg;
  }

  private calculateTotalCost(cost: number, quantity: number): number {
    return cost * quantity;
  }

  private async createOrderRecord(orderData: any) {
    return await this.orderModel.create({
      user: Types.ObjectId.createFromHexString(orderData.user),
      packageProxy: Types.ObjectId.createFromHexString(orderData.packageProxy),
      location: Types.ObjectId.createFromHexString(orderData.location),
      quantity: orderData.quantity,
      sumcost: orderData.sumcost,
      status: orderData.status,
      detailTemplate: orderData.detailTemplate,
    });
  }

  private async findOrderById(id: string) {
    const order = await this.orderModel.findById(id).exec();
    if (!order) {
      throw new NotFoundException(`Order ${id} not found`);
    }
    return order;
  }

  private async processPaymentStatus(order: any) {
    const pkg = await this.validateAndGetPackage(order.packageProxy);
    const availableIps = await this.getAvailableIps(order);

    if (availableIps.length < order.quantity) {
      throw new BadRequestException(
        `Không đủ IP khả dụng. Cần: ${order.quantity}, Có sẵn: ${availableIps.length}`,
      );
    }

    const orderDetails = this.buildOrderDetails(availableIps, order, pkg);
    await this.createOrderDetails(orderDetails);
    await this.markIpsAsAssigned(availableIps, order._id);
  }

  private async getAvailableIps(order: any) {
    return await this.ipProxyModel
      .find({
        packageProxy: order.packageProxy,
        isActive: false,
        location: order.location,
      })
      .limit(order.quantity);
  }

  private buildOrderDetails(ips: any[], order: any, pkg: any) {
    const template = order.detailTemplate || {};

    return ips.map((ip) => ({
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
  }

  private async createOrderDetails(details: any[]) {
    await this.orderDetailModel.insertMany(details);
  }

  private async markIpsAsAssigned(ips: any[], orderId: string) {
    const ipIds = ips.map((ip) => ip._id);

    await this.ipProxyModel.updateMany(
      { _id: { $in: ipIds } },
      { $set: { isActive: true, assignedOrder: orderId } },
    );
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
