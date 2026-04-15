// src/products/products.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, SetMetadata, UseGuards, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { UserRole } from 'src/auth/entities/auth.entity';
import { RolesGuard } from 'src/auth/guards/roles/roles.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('products')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @UseGuards(RolesGuard)
  @Post()
  @SetMetadata('roles', [UserRole.ADMIN, UserRole.EDITOR])
  create(@Body('name') name: string, @Body('description') description: string) {
    return this.productsService.create(name, description);
  }

  @Get()
  findAll(@Query('status') status: string) {
    return this.productsService.findAll();
  }

  @UseGuards(RolesGuard)
  @Patch(':id')
  @SetMetadata('roles', [UserRole.ADMIN, UserRole.EDITOR])
  update(@Param('id') id: string, @Body('name') name: string, @Body('description') description: string) {
    return this.productsService.update(id, name, description);
  }

  // @Delete(':id')
  // @UseGuards(RolesGuard)
  // @SetMetadata('roles', [UserRole.ADMIN]) 
  // remove(@Param('id') id: string) {
  //   return this.productsService.remove(id);
  // }


  @Delete(':id')
  @UseGuards(RolesGuard)
  @SetMetadata('roles', [UserRole.ADMIN])
  async remove(@Param('id') id: string) {
    return this.productsService.toggleArchive(id);
  }

  @Delete(':id/permanent')
  @UseGuards(RolesGuard)
  @SetMetadata('roles', [UserRole.ADMIN])
  async hardDelete(@Param('id') id: string) {
    return this.productsService.removePermanently(id);
  }
}