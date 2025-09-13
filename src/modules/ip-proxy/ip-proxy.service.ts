import { Injectable } from '@nestjs/common';
import { CreateIpProxyDto } from '@/modules/ip-proxy/dto/create-ip-proxy.dto';
import { UpdateIpProxyDto } from '@/modules/ip-proxy/dto/update-ip-proxy.dto';

@Injectable()
export class IpProxyService {
  create(createIpProxyDto: CreateIpProxyDto) {
    return 'This action adds a new ipProxy';
  }

  findAll() {
    return `This action returns all ipProxy`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ipProxy`;
  }

  update(id: number, updateIpProxyDto: UpdateIpProxyDto) {
    return `This action updates a #${id} ipProxy`;
  }

  remove(id: number) {
    return `This action removes a #${id} ipProxy`;
  }
}
