import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateConsumerDto } from './dto/create-consumer.dto';
import { UpdateConsumerDto } from './dto/update-consumer.dto';
import { Repository } from 'typeorm';
import { Consumer } from './entities/consumer.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ConsumersService {
  constructor(
    @InjectRepository(Consumer)
    private readonly consumerRepository: Repository<Consumer>,
  ) {}
  async create(createConsumerDto: CreateConsumerDto): Promise<Consumer> {
    const consumerExist = await this.findByCpf(createConsumerDto.cpf);

    if (consumerExist) {
      throw new ConflictException('Este CPF já está registrado');
    }

    const consumer = this.consumerRepository.create(createConsumerDto);

    return await this.consumerRepository.save(consumer);
  }

  async findAll(): Promise<Consumer[]> {
    return await this.consumerRepository.find({});
  }

  async findOne(id: number): Promise<Consumer | null> {
    const consumer = await this.consumerRepository.findOneBy({ id });

    if (!consumer) {
      throw new NotFoundException(`Consumidor com ID ${id} não encontrado`);
    }
    return consumer;
  }

  async findByCpf(cpf: string) {
    return await this.consumerRepository.findOneBy({ cpf });
  }

  async update(
    id: number,
    updateConsumerDto: UpdateConsumerDto,
  ): Promise<Consumer> {
    const consumer = await this.consumerRepository.preload({
      id,
      ...updateConsumerDto,
    });

    if (!consumer) {
      throw new NotFoundException(`Consumidor com ID ${id} não encontrado`);
    }

    return await this.consumerRepository.save(consumer);
  }

  async remove(id: number) {
    const consumersAffected = await this.consumerRepository.delete({ id });

    if (consumersAffected.affected === 0) {
      throw new NotFoundException(`Consumidor com ID ${id} não encontrado`);
    }
  }
}
