import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { IpProxyService } from '@/modules/ip-proxy/ip-proxy.service';
import { CreateIpProxyDto } from '@/modules/ip-proxy/dto/create-ip-proxy.dto';
import { UpdateIpProxyDto } from '@/modules/ip-proxy/dto/update-ip-proxy.dto';

@Controller('ip-proxy')
export class IpProxyController {
  constructor(private readonly ipProxyService: IpProxyService) {}

  @Post()
  create(@Body() createIpProxyDto: CreateIpProxyDto) {
    return this.ipProxyService.create(createIpProxyDto);
  }

  @Get()
  findAll() {
    return this.ipProxyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ipProxyService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateIpProxyDto: UpdateIpProxyDto) {
    return this.ipProxyService.update(id, updateIpProxyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ipProxyService.remove(id);
  }
}
