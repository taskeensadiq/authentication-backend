import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from '../auth/entities/role.entity';
import { Permission } from '../auth/entities/permissions.entity';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { User } from 'src/auth/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Role, Permission, User]), RolesModule],
  controllers: [RolesController],
  providers: [RolesService],
})
export class RolesModule {}