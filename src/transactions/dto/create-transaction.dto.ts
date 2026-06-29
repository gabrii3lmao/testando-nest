import { IsArray, IsNotEmpty, IsNumber, Min } from 'class-validator';
import { TransactionItems } from './create-transactionItem.dto';

export class CreateTransactionDto {
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  consumer_id: number;

  @IsNotEmpty()
  @IsArray()
  items: TransactionItems[];
}
