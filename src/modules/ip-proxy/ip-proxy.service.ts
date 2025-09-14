import { Injectable } from '@nestjs/common';
import { CreateIpProxyDto } from '@/modules/ip-proxy/dto/create-ip-proxy.dto';
import { UpdateIpProxyDto } from '@/modules/ip-proxy/dto/update-ip-proxy.dto';
import { InjectModel } from '@nestjs/mongoose';
import { IpProxy } from '@/modules/ip-proxy/schemas/ip-proxy.schema';
import { Model } from 'mongoose';

@Injectable()
export class IpProxyService {
  constructor(
    @InjectModel(IpProxy.name) private proxyListModel: Model<IpProxy>,
  ) {}

  async create(createIpProxyDto: CreateIpProxyDto) {
    return 'This action adds a new ipProxy';
  }

  async findAll() {
    return await this.proxyListModel.find().exec();
  }

  async findOne(id: string) {
    return await this.proxyListModel.findById(id).exec();
  }

  async update(id: string, updateIpProxyDto: UpdateIpProxyDto) {
    return `This action updates a #${id} ipProxy`;
  }

  async remove(id: string) {
    return await this.proxyListModel.findByIdAndDelete(id).exec();
  }
}
