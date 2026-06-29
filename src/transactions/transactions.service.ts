import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { ProdutosService } from 'src/products/products.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { TransactionItemService } from './transaction-item.service';

@Injectable()
export class TransactionsService {
  constructor(
    private productService: ProdutosService,
    private transactionItemService: TransactionItemService,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  async create(createTransactionDto: CreateTransactionDto) {
    const items = createTransactionDto.items;

    const totalPrice = items.reduce((acc, item) => {
      return acc + item.quantity * item.price_at_purchase;
    }, 0);

    const transaction = this.transactionRepository.create({
      consumer_id: createTransactionDto.consumer_id,
      total_value: totalPrice,
    });

    const savedTransaction = await this.transactionRepository.save(transaction);

    await this.transactionItemService.create(savedTransaction.id, items);

    return { savedTransaction, items };
  }

  findAll() {
    return `This action returns all transactions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} transaction`;
  }

  update(id: number, updateTransactionDto: UpdateTransactionDto) {
    return `This action updates a #${id} transaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} transaction`;
  }
}
