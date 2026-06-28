import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-users.dto';
import { UpdateUserDto } from './dto/update-users.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/usuario.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly usuarioRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
    const salt = 10;
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    const newUser = this.usuarioRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    const user = await this.usuarioRepository.save(newUser);

    const { password, ...userWithoutPassword } = user;

    return userWithoutPassword;
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.usuarioRepository.findOneBy({ email: email });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const usuario = await this.usuarioRepository.preload({
      id: id,
      ...updateUserDto,
    });

    if (!usuario) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }

    return await this.usuarioRepository.save(usuario);
  }

  async remove(id: number): Promise<void> {
    const userToUpdate = await this.usuarioRepository.delete({ id: id });

    if (userToUpdate.affected === 0) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }
  }
}
