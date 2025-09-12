import { Injectable } from '@nestjs/common';
import { CreatePackageProxyDto } from '@/modules/package-proxy/dto/create-package-proxy.dto';
import { UpdatePackageProxyDto } from '@/modules/package-proxy/dto/update-package-proxy.dto';

@Injectable()
export class PackageProxyService {
  create(createPackageProxyDto: CreatePackageProxyDto) {
    return 'This action adds a new packageProxy';
  }

  findAll() {
    return `This action returns all packageProxy`;
  }

  findOne(id: number) {
    return `This action returns a #${id} packageProxy`;
  }

  update(id: number, updatePackageProxyDto: UpdatePackageProxyDto) {
    return `This action updates a #${id} packageProxy`;
  }

  remove(id: number) {
    return `This action removes a #${id} packageProxy`;
  }
}
