import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsController } from './products/products.controller';
import { ProductsService } from './products/products.service';
import { ProductsModule } from './products/products.module';
import { RolesModule } from './roles/roles.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }),
  TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (config: ConfigService) => ({
      type: 'postgres',
      host: config.get<string>('DB_HOST') || 'localhost',
      port: config.get<number>('DB_PORT') || 5432,
      username: config.get<string>('DB_USER') || 'postgres',
      password: config.get<string>('DB_PASS') || 'password',
      database: config.get<string>('DB_NAME') || 'auth_db',
      autoLoadEntities: true,
      synchronize: true,
    }),
  }),
    AuthModule,
    ProductsModule,
    RolesModule],
  controllers: [AppController],
  providers: [AppService,],
})
export class AppModule { }
