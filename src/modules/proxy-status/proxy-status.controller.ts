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

  @Public()
  @Get('summary')
  async getDashboardSummary() {
    const summary = await this.proxyStatusService.getDashboardSummary();
    return { success: true, data: summary };
  }

  @Public()
  @Get('recent-orders')
  async getRecentOrders() {
    const orders = await this.proxyStatusService.getRecentOrders();
    return { success: true, data: orders };
  }

  @Public()
  @Get('locations')
  async getProxyLocations() {
    const data = await this.proxyStatusService.getProxyLocations();
    return { success: true, data };
  }
}
