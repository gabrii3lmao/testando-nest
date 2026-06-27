import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProdutosModule } from './produtos/produtos.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'admin@123',
      database: 'projetinho_nest',
      autoLoadEntities: true, // Carrega entidades automaticamente sem precisar listá-las uma a uma
      synchronize: true, // ATENÇÃO: Use apenas em desenvolvimento! Isso recria as tabelas. Em produção, use Migrations.
    }),
    ProdutosModule,
    AuthModule,
    UsersModule,
  ],
})
export class AppModule {}
