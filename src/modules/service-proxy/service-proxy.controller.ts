import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ServiceProxyService } from '@/modules/service-proxy/service-proxy.service';
import { CreateServiceProxyDto } from '@/modules/service-proxy/dto/create-service-proxy.dto';
import { UpdateServiceProxyDto } from '@/modules/service-proxy/dto/update-service-proxy.dto';

@Controller('service-proxy')
export class ServiceProxyController {
  constructor(private readonly serviceProxyService: ServiceProxyService) {}

  @Post()
  create(@Body() createServiceProxyDto: CreateServiceProxyDto) {
    return this.serviceProxyService.create(createServiceProxyDto);
  }

  @Get()
  findAll() {
    return this.serviceProxyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.serviceProxyService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateServiceProxyDto: UpdateServiceProxyDto) {
    return this.serviceProxyService.update(+id, updateServiceProxyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.serviceProxyService.remove(+id);
  }
}
