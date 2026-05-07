

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  SetMetadata,
  UseGuards,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';

import { ProductsService } from './products.service';
import { AuthGuard } from '@nestjs/passport';
import { PermissionsGuard } from 'src/auth/guards/permissions/permissions.guard';

@Controller('products')
@UseGuards(AuthGuard('jwt'), PermissionsGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // CREATE
  @Post()
  @SetMetadata('permissions', ['product:create'])
  create(
    @Body('name') name: string,
    @Body('description') description: string,
  ) {
    return this.productsService.create(name, description);
  }

  // READ
  
  @Get()
  @SetMetadata('permissions', ['product:read'])
  findAll(
    @Query('status') status: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.productsService.findAll(status, page, limit);
  }

  // READ ONE
  @Get(':id')
  @SetMetadata('permissions', ['product:read'])
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  // UPDATE
  @Patch(':id')
  @SetMetadata('permissions', ['product:update'])
  update(
    @Param('id') id: string,
    @Body('name') name: string,
    @Body('description') description: string,
  ) {
    return this.productsService.update(id, name, description);
  }

  // ARCHIVE
  @Delete(':id')
  @SetMetadata('permissions', ['product:archive'])
  remove(@Param('id') id: string) {
    return this.productsService.toggleArchive(id);
  }

  // DELETE
  @Delete(':id/permanent')
  @SetMetadata('permissions', ['product:delete'])
  hardDelete(@Param('id') id: string) {
    return this.productsService.removePermanently(id);
  }
}