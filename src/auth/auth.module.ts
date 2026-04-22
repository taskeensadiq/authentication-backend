import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auth } from './entities/auth.entity';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [  
    TypeOrmModule.forFeature([Auth]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'secret_key_for_jwt',
        signOptions: { expiresIn: '1h' },})
  })],

  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
