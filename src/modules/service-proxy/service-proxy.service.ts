import { Injectable } from '@nestjs/common';
import { CreateServiceProxyDto } from './dto/create-service-proxy.dto';
import { UpdateServiceProxyDto } from './dto/update-service-proxy.dto';

@Injectable()
export class ServiceProxyService {
  create(createServiceProxyDto: CreateServiceProxyDto) {
    return 'This action adds a new serviceProxy';
  }

  findAll() {
    return `This action returns all serviceProxy`;
  }

  findOne(id: number) {
    return `This action returns a #${id} serviceProxy`;
  }

  update(id: number, updateServiceProxyDto: UpdateServiceProxyDto) {
    return `This action updates a #${id} serviceProxy`;
  }

  remove(id: number) {
    return `This action removes a #${id} serviceProxy`;
  }
}
