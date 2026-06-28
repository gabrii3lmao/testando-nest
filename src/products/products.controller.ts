import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ProdutosService } from './products.service';
import { CreateProdutoDto } from './dto/create-product.dto';
import { UpdateProdutoDto } from './dto/update-product.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

@Controller('produtos')
@UseGuards(JwtAuthGuard)
export class ProdutosController {
  constructor(private readonly produtosService: ProdutosService) {}

  @Post()
  create(
    @Body() createProdutoDto: Omit<CreateProdutoDto, 'user_id'>,
    @CurrentUser() userId: number,
  ) {
    return this.produtosService.create({ ...createProdutoDto, user_id: userId });
  }

  @Get()
  findAll(@CurrentUser() userId: number) {
    return this.produtosService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() userId: number) {
    return this.produtosService.findOne(+id, userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @CurrentUser() userId: number,
    @Body() updateProdutoDto: UpdateProdutoDto,
  ) {
    return this.produtosService.update(+id, userId, updateProdutoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() userId: number) {
    return this.produtosService.remove(+id, userId);
  }
}
