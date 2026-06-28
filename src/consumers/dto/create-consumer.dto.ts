import { IsNotEmpty, IsString } from 'class-validator';
import { IsCPF } from 'cpf-cnpj-validator/class-validator'; // <-- O "Cpf" é com letras minúsculas no final

export class CreateConsumerDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome é obrigatório.' })
  name: string;

  @IsCPF({ message: 'O CPF informado é inválido.' })
  cpf: string;

  @IsString()
  @IsNotEmpty({ message: 'O número de telefone é obrigatório.' })
  phoneNumber: string;
}
