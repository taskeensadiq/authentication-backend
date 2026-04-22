import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) { }

  // CREATE
  async create(name: string, description: string): Promise<Product> {
    const newProduct = this.productRepository.create({ name, description });
    return await this.productRepository.save(newProduct);
  }

  // READ
  async findAll(status?: string, page: number = 1, limit: number = 10): Promise< { data: Product[], total: number, page: number, limit: number, totalPages: number }> {
    const query = this.productRepository.createQueryBuilder('product');

    if (status === 'active') {
      query.where('product.isArchived = :isArchived', { isArchived: false });
    } else if (status === 'archived') {
      query.where('product.isArchived = :isArchived', { isArchived: true });
    }

    query.orderBy('product.createdAt', 'DESC');

    const [data, total] = await query.skip((page - 1) * limit).take(limit).getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
      totalPages: limit > 0 ? Math.ceil(total / limit) : 0,
    }
  }

  // UPDATE
  async update(id: string, name: string, description: string): Promise<Product> {
    const product = await this.productRepository.preload({
      id,
      name,
      description,
    });
    if (!product) throw new NotFoundException('Product not found');
    return await this.productRepository.save(product);
  }

  async toggleArchive(id: string) {
    const product = await this.productRepository.findOneBy({ id });
    if (!product) throw new NotFoundException('Product not found');

    const willBeArchived = !product.isArchived;
    product.isArchived = willBeArchived;
    product.archivedAt = new Date();

    const saved = await this.productRepository.save(product);

    return {
      ...saved,
      justRestored: !willBeArchived
    };
  }

  async removePermanently(id: string) {
    const result = await this.productRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException('Product not found');
    return { deleted: true};
  }

  async findOne(id: string): Promise<Product> {
  const product = await this.productRepository.findOneBy({ id });

  if (!product) {
    throw new NotFoundException('Product not found');
  }

  return product;
}
}