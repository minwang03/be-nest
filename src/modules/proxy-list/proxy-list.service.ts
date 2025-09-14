import { Injectable } from '@nestjs/common';
import { CreateProxyListDto } from '@/modules/proxy-list/dto/create-proxy-list.dto';
import { UpdateProxyListDto } from '@/modules/proxy-list/dto/update-proxy-list.dto';
import { ProxyList } from './schemas/proxy-list.schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ProxyListService {
  constructor(
    @InjectModel(ProxyList.name) private proxyListModel: Model<ProxyList>,
  ) {}

  async create(createProxyListDto: CreateProxyListDto) {
    const { name, note } = createProxyListDto;

    const proxyList = await this.proxyListModel.create({
      name,
      note,
    });

    return {
      _id: proxyList.id,
    };
  }

  async findAll() {
    return await this.proxyListModel.find().exec();
  }

  async findOne(id: string) {
    return await this.proxyListModel.findById(id).exec();
  }

  async update(id: string, updateProxyListDto: UpdateProxyListDto) {
    return await this.proxyListModel.updateOne(
      { _id: new Types.ObjectId(id) },
      { $set: updateProxyListDto },
    );
  }

  async remove(id: string) {
    return await this.proxyListModel.findByIdAndDelete(id).exec();
  }
}
