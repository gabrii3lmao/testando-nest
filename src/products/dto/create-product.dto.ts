import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateProdutoDto {
  @Type(() => Number)
  @IsOptional()
  user_id: number;

  @IsNotEmpty()
  name: string;

  @Type(() => Number)
  @Min(0)
  price: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  quantity: number;
}
