import { Injectable } from '@nestjs/common';
import { TransactionItem } from './entities/transaction-item.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionItems } from './dto/create-transactionItem.dto';

@Injectable()
export class TransactionItemService {
  constructor(
    @InjectRepository(TransactionItem)
    private readonly transactionItemRepository: Repository<TransactionItem>,
  ) {}

  async create(transaction_id: number, items: TransactionItems[]) {
    const entitiesToSave = items.map((item) =>
      this.transactionItemRepository.create({
        transaction_id,
        product_id: item.product_id,
        quantity: item.quantity,
        price_at_purchase: item.price_at_purchase,
      }),
    );

    await this.transactionItemRepository.save(entitiesToSave);
  }
}
