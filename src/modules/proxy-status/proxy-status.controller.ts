import { Controller, Get, Query } from '@nestjs/common';
import { ProxyStatusService } from './proxy-status.service';
import { Public } from '@/decorator/customize';

@Controller('proxy-status')
export class ProxyStatusController {
  constructor(private readonly proxyStatusService: ProxyStatusService) {}

  @Public()
  @Get()
  async getStatus(@Query('service') service?: string) {
    const data = await this.proxyStatusService.getProxyStatus(service);
    return { success: true, data };
  }
}
