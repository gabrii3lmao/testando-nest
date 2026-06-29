import { IsNotEmpty, IsString, Length } from 'class-validator';
import { IsCPF } from 'cpf-cnpj-validator/class-validator';

export class CreateConsumerDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome é obrigatório.' })
  name: string;

  @IsCPF({ message: 'O CPF informado é inválido.' })
  cpf: string;

  @IsString()
  @Length(11)
  phone_number: string;
}
