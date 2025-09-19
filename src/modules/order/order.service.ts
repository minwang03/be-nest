import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto, OrderStatus } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './schemas/order.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, HydratedDocument } from 'mongoose';
import { OrderDetail } from '../order-detail/schemas/order-detail.schema';
import { IpProxy } from '../ip-proxy/schemas/ip-proxy.schema';
import { PackageProxy } from '../package-proxy/schemas/package-proxy.schema';
import { User, UserDocument } from '../users/schemas/user.schema';

type OrderDocument = HydratedDocument<Order>;
type IpProxyDocument = HydratedDocument<IpProxy>;
type PackageProxyDocument = HydratedDocument<PackageProxy>;
type OrderDetailDocument = HydratedDocument<OrderDetail>;

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name)
    private orderModel: Model<OrderDocument>,
    @InjectModel(OrderDetail.name)
    private orderDetailModel: Model<OrderDetailDocument>,
    @InjectModel(IpProxy.name)
    private ipProxyModel: Model<IpProxyDocument>,
    @InjectModel(PackageProxy.name)
    private packageProxyModel: Model<PackageProxyDocument>,
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  async create(userId: string, createOrderDto: CreateOrderDto) {
    const { packageProxy, quantity, status, detailTemplate, location } =
      createOrderDto;

    const pkg = await this.validateAndGetPackage(packageProxy);
    const sumcost = this.calculateTotalCost(pkg.cost, quantity);

    const order = await this.orderModel.create({
      user: new Types.ObjectId(userId),
      packageProxy: new Types.ObjectId(packageProxy),
      location: new Types.ObjectId(location),
      quantity,
      sumcost,
      status: status || OrderStatus.PENDING,
      detailTemplate,
    });

    return { _id: order._id, status: order.status, sumcost, quantity };
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

  // ====================== UPDATE STATUS ======================

  // Hàm cập nhật trạng thái
  async updateStatus(id: string, status: OrderStatus) {
    const order = await this.findOrderById(id);

    if (status === OrderStatus.PAID && order.status !== OrderStatus.PAID) {
      await this.processPaymentStatus(order);
    }

    order.status = status;
    await order.save();
    return order;
  }

  // ====================== HELPER FUNCTIONS ======================

  // Hàm kiểm tra số dư
  private async checkUserBalance(userId: string, amount: number) {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException(`User ${userId} not found`);
    }

    if (user.balance < amount) {
      throw new BadRequestException('Số dư không đủ để thực hiện giao dịch');
    }

    return user;
  }

  // Hàm trừ tiền
  async deductUserBalance(userId: string, amount: number) {
    const user = await this.checkUserBalance(userId, amount); 
    user.balance -= amount;
    await user.save();

    return user;
  }

  // Hàm kiểm tra package tồn tại
  private async validateAndGetPackage(
    packageProxyId: string,
  ): Promise<PackageProxyDocument> {
    const pkg = await this.packageProxyModel.findById(packageProxyId).exec();
    if (!pkg) {
      throw new BadRequestException('Package không tồn tại');
    }
    return pkg;
  }

  // Hàm tính tổng tiền order
  private calculateTotalCost(cost: number, quantity: number): number {
    return cost * quantity;
  }

  // Hàm tìm order theo ID
  private async findOrderById(id: string): Promise<OrderDocument> {
    const order = await this.orderModel.findById(id).exec();
    if (!order) {
      throw new NotFoundException(`Order ${id} not found`);
    }
    return order;
  }

  // Hàm lấy danh sách IP khả dụng cho order
  private async getAvailableIps(
    order: OrderDocument,
  ): Promise<IpProxyDocument[]> {
    return await this.ipProxyModel
      .find({
        packageProxy: order.packageProxy,
        isActive: false,
        location: order.location,
      })
      .limit(order.quantity)
      .lean()
      .exec();
  }

  // Hàm tạo order detail cho từng IP dựa trên template
  private async createOrderDetailsFromTemplate(
    ips: IpProxyDocument[],
    order: OrderDocument,
    pkg: PackageProxyDocument,
  ) {
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

    await this.orderDetailModel.insertMany(details);
  }

  // Hàm đánh dấu IP đã cấp để tránh cấp trùng
  private async markIpsAsAssigned(ips: IpProxyDocument[]) {
    const ipIds = ips.map((ip) => ip._id);

    await this.ipProxyModel.updateMany(
      { _id: { $in: ipIds } },
      { $set: { isActive: true } },
    );
  }

  // ========= PROCCESS PAYMENT (PAID)  =========

  // Hàm sử lý quy trình chuyển trạng thái
  private async processPaymentStatus(order: OrderDocument) {
    // 1. Lấy IP khả dụng tương ứng với package và location
    const availableIps = await this.getAvailableIps(order);

    // 2. Kiểm tra có đủ IP cho order không
    if (availableIps.length < order.quantity) {
      throw new BadRequestException(
        `Không đủ IP khả dụng. Cần: ${order.quantity}, Có sẵn: ${availableIps.length}`,
      );
    }

    // 3. Kiểm tra và trừ tiền của user
    const user = await this.deductUserBalance(
      order.user.toString(),
      order.sumcost,
    );

    // 4. Lấy package gắn vào order
    const pkg = await this.validateAndGetPackage(order.packageProxy.toString());

    // 5. Tạo order detail cho từng IP
    await this.createOrderDetailsFromTemplate(availableIps, order, pkg);

    // 6. Đánh dấu IP đã được cấp
    await this.markIpsAsAssigned(availableIps);
  }
}
