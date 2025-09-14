import { Injectable } from '@nestjs/common';
import { CreatePackageProxyDto } from '@/modules/package-proxy/dto/create-package-proxy.dto';
import { UpdatePackageProxyDto } from '@/modules/package-proxy/dto/update-package-proxy.dto';
import { InjectModel } from '@nestjs/mongoose';
import { PackageProxy } from './schemas/package-proxy.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class PackageProxyService {
  constructor(
    @InjectModel(PackageProxy.name)
    private packageProxyModel: Model<PackageProxy>,
  ) {}

  async create(createPackageProxyDto: CreatePackageProxyDto) {
    const { name, expiry, cost, serviceProxy } = createPackageProxyDto;

    const packageProxy = await this.packageProxyModel.create({
      name,
      expiry,
      cost,
      serviceProxy: new Types.ObjectId(serviceProxy),
    });

    return {
      _id: packageProxy._id,
    };
  }

  async findAll() {
    return await this.packageProxyModel.find().exec();
  }

  async findOne(id: string) {
    return await this.packageProxyModel
      .findById(id)
      .populate('serviceProxy', 'name proxyType isActive')
      .exec();
  }

  async update(id: string, updatePackageProxyDto: UpdatePackageProxyDto) {
    return await this.packageProxyModel.updateOne(
      { _id: new Types.ObjectId(id) },
      { $set: updatePackageProxyDto },
    );
  }

  async remove(id: string) {
    return await this.packageProxyModel.findByIdAndDelete(id).exec();
  }
}
