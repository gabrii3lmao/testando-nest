import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Consumer } from 'src/consumers/entities/consumer.entity';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  consumer_id: number;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at: Date;

  @Column('decimal', { precision: 10, scale: 2 })
  total_value: number;

  @ManyToOne(() => Consumer)
  @JoinColumn({ name: 'consumer_id' })
  consumer: Consumer;
}
