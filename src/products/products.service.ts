import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProdutoDto } from './dto/create-product.dto';
import { UpdateProdutoDto } from './dto/update-product.dto';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';

@Injectable()
export class ProdutosService {
  constructor(
    @InjectRepository(Product)
    private readonly produtoRepository: Repository<Product>,
  ) {}

  async create(createProdutoDto: CreateProdutoDto): Promise<Product> {
    const newProduct = this.produtoRepository.create(createProdutoDto);
    return await this.produtoRepository.save(newProduct);
  }

  async findAll(userId: number): Promise<Product[]> {
    return await this.produtoRepository.find({ where: { user_id: userId } });
  }

  async findOne(id: number, userId: number): Promise<Product | null> {
    const product = await this.produtoRepository.findOneBy({
      id,
      user_id: userId,
    });

    if (!product) {
      throw new NotFoundException(`Produto com ID ${id} não encontrado`);
    }

    return product;
  }

  async update(
    id: number,
    userId: number,
    updateProdutoDto: UpdateProdutoDto,
  ): Promise<Product> {
    const product = await this.produtoRepository.preload({
      id,
      user_id: userId,
      ...updateProdutoDto,
    });

    if (!product) {
      throw new NotFoundException(`Produto com ID ${id} não encontrado`);
    }

    return await this.produtoRepository.save(product);
  }

  async remove(id: number, userId: number): Promise<void> {
    const productToUpdate = await this.produtoRepository.delete({
      id,
      user_id: userId,
    });

    if (productToUpdate.affected === 0) {
      throw new NotFoundException(`Produto com ID ${id} não encontrado`);
    }
  }
}
