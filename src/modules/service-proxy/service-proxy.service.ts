import { Injectable } from '@nestjs/common';
import { CreateServiceProxyDto } from '@/modules/service-proxy/dto/create-service-proxy.dto';
import { UpdateServiceProxyDto } from '@/modules/service-proxy/dto/update-service-proxy.dto';
import { Model, Types } from 'mongoose';
import { ServiceProxy } from '@/modules/service-proxy/schemas/service-proxy.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ServiceProxyService {
  constructor(
    @InjectModel(ServiceProxy.name)
    private serviceProxyModel: Model<ServiceProxy>,
  ) {}

  async create(createServiceProxyDto: CreateServiceProxyDto) {
    const { name, proxyType } = createServiceProxyDto;

    const serviceProxy = await this.serviceProxyModel.create({
      name,
      proxyType,
    });

    return {
      _id: serviceProxy._id,
    };
  }

  async findAll() {
    return await this.serviceProxyModel.find().exec();
  }

  async findOne(id: string) {
    return await this.serviceProxyModel.findById(id).exec();
  }

  async update(id: string, updateServiceProxyDto: UpdateServiceProxyDto) {
    return await this.serviceProxyModel.updateOne(
      { _id: new Types.ObjectId(id) },
      { $set: updateServiceProxyDto },
    );
  }

  async remove(id: string) {
    return await this.serviceProxyModel.findByIdAndDelete(id).exec();
  }
}
