import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { ProdutosModule } from 'src/products/product.module';
import { TransactionItem } from './entities/transaction-item.entity';
import { ConsumersModule } from 'src/consumers/consumers.module';
import { TransactionItemService } from './transaction-item.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction, TransactionItem]),
    ProdutosModule,
    ConsumersModule,
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService, TransactionItemService],
})
export class TransactionsModule {}
