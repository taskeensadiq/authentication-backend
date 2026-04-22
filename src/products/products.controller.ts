import { Controller, Get, Post, Body, Patch, Param, Delete, SetMetadata, UseGuards, Query, DefaultValuePipe, ParseIntPipe } from '@nestjs/common';
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
  findAll(
    @Query('status') status: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.productsService.findAll(status, page, limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @UseGuards(RolesGuard)
  @Patch(':id')
  @SetMetadata('roles', [UserRole.ADMIN, UserRole.EDITOR])
  update(@Param('id') id: string, @Body('name') name: string, @Body('description') description: string) {
    return this.productsService.update(id, name, description);
  }

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