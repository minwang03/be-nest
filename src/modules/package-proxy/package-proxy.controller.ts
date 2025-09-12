import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PackageProxyService } from '@/modules/package-proxy/package-proxy.service';
import { CreatePackageProxyDto } from '@/modules/package-proxy/dto/create-package-proxy.dto';
import { UpdatePackageProxyDto } from '@/modules/package-proxy/dto/update-package-proxy.dto';

@Controller('package-proxy')
export class PackageProxyController {
  constructor(private readonly packageProxyService: PackageProxyService) {}

  @Post()
  create(@Body() createPackageProxyDto: CreatePackageProxyDto) {
    return this.packageProxyService.create(createPackageProxyDto);
  }

  @Get()
  findAll() {
    return this.packageProxyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.packageProxyService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePackageProxyDto: UpdatePackageProxyDto) {
    return this.packageProxyService.update(+id, updatePackageProxyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.packageProxyService.remove(+id);
  }
}
