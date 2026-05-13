import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from 'src/auth/entities/role.entity';
import { Permission } from 'src/auth/entities/permissions.entity';
import { User } from 'src/auth/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  controllers: [UsersController],
  providers: [UsersService, ],
  imports: [
    TypeOrmModule.forFeature([Role, Permission, User]),
    // JwtModule.register({})
    JwtModule.registerAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: async (configService: ConfigService) => ({
            secret: configService.get<string>('JWT_SECRET') || 'secret_key_for_jwt',
            signOptions: { expiresIn: '1h' },})
      })
  ],
})
export class UsersModule {}
