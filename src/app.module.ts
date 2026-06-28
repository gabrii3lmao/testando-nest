import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProdutosModule } from './produtos/produtos.module';
import { AuthModule } from './auth/auth.module';
import { UsuariosModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'admin@123',
      database: 'projetinho_nest',
      autoLoadEntities: true,
      synchronize: true, // ATENÇÃO: Use apenas em desenvolvimento! Isso recria as tabelas. Em produção, use Migrations.
    }),
    ProdutosModule,
    AuthModule,
    UsuariosModule,
    ConfigModule.forRoot(),
  ],
})
export class AppModule {}
