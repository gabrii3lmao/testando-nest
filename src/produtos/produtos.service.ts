import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';
import { Repository } from 'typeorm';
import { Product } from './entities/produto.entity';

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

  async findAll(): Promise<Product | Product[]> {
    return await this.produtoRepository.find();
  }

  async findOne(id: number): Promise<Product | null> {
    const user = await this.produtoRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`Produto com ID ${id} não encontrado`);
    }

    return user;
  }

  async update(
    id: number,
    updateProdutoDto: UpdateProdutoDto,
  ): Promise<Product> {
    const product = await this.produtoRepository.preload({
      id,
      ...updateProdutoDto,
    });

    if (!product) {
      throw new NotFoundException(`Produto com ID ${id} não encontrado`);
    }
    return await this.produtoRepository.save(product);
  }

  async remove(id: number): Promise<void> {
    const productToUpdate = await this.produtoRepository.delete({ id });

    if (productToUpdate.affected === 0) {
      throw new NotFoundException(`Produto com ID ${id} não encontrado`);
    }
  }
}
