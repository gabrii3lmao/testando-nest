import { Module } from '@nestjs/common';
import { ProdutosService } from './products.service';
import { ProdutosController } from './products.controller';
import { Product } from './entities/product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  controllers: [ProdutosController],
  providers: [ProdutosService],
})
export class ProdutosModule {}
