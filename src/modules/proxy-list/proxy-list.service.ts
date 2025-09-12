import { Injectable } from '@nestjs/common';
import { CreateProxyListDto } from '@/modules/proxy-list/dto/create-proxy-list.dto';
import { UpdateProxyListDto } from '@/modules/proxy-list/dto/update-proxy-list.dto';

@Injectable()
export class ProxyListService {
  create(createProxyListDto: CreateProxyListDto) {
    return 'This action adds a new proxyList';
  }

  findAll() {
    return `This action returns all proxyList`;
  }

  findOne(id: number) {
    return `This action returns a #${id} proxyList`;
  }

  update(id: number, updateProxyListDto: UpdateProxyListDto) {
    return `This action updates a #${id} proxyList`;
  }

  remove(id: number) {
    return `This action removes a #${id} proxyList`;
  }
}
