import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProxyListService } from '@/modules/proxy-list/proxy-list.service';
import { CreateProxyListDto } from '@/modules/proxy-list/dto/create-proxy-list.dto';
import { UpdateProxyListDto } from '@/modules/proxy-list/dto/update-proxy-list.dto';

@Controller('proxy-list')
export class ProxyListController {
  constructor(private readonly proxyListService: ProxyListService) {}

  @Post()
  create(@Body() createProxyListDto: CreateProxyListDto) {
    return this.proxyListService.create(createProxyListDto);
  }

  @Get()
  findAll() {
    return this.proxyListService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.proxyListService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProxyListDto: UpdateProxyListDto) {
    return this.proxyListService.update(+id, updateProxyListDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.proxyListService.remove(+id);
  }
}
