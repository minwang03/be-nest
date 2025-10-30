import { Injectable } from '@nestjs/common';
import { CreateIpProxyDto } from '@/modules/ip-proxy/dto/create-ip-proxy.dto';
import { UpdateIpProxyDto } from '@/modules/ip-proxy/dto/update-ip-proxy.dto';
import { InjectModel } from '@nestjs/mongoose';
import { IpProxy } from '@/modules/ip-proxy/schemas/ip-proxy.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class IpProxyService {
  constructor(
    @InjectModel(IpProxy.name) private ipProxyModel: Model<IpProxy>,
  ) {}

  async create(createIpProxyDto: CreateIpProxyDto) {
    const { address, port, packageProxy, proxyList, location } =
      createIpProxyDto;

    const ipProxy = await this.ipProxyModel.create({
      address,
      port,
      packageProxy: new Types.ObjectId(packageProxy),
      proxyList: new Types.ObjectId(proxyList),
      location: new Types.ObjectId(location),
    });

    return {
      _id: ipProxy._id,
    };
  }

  async findAll() {
    return await this.ipProxyModel
      .find()
      .populate('packageProxy', '_id name')
      .populate('proxyList', '_id name')
      .populate('location', '_id name')
      .exec();
  }

  async findOne(id: string) {
    return await this.ipProxyModel
      .findById(id)
      .populate('packageProxy', 'name expiry cost')
      .populate('proxyList', 'name note')
      .populate('location', 'name code')
      .exec();
  }

  async update(id: string, updateIpProxyDto: UpdateIpProxyDto) {
    return await this.ipProxyModel.updateOne(
      { _id: new Types.ObjectId(id) },
      { $set: updateIpProxyDto },
    );
  }

  async remove(id: string) {
    return await this.ipProxyModel.findByIdAndDelete(id).exec();
  }
}
