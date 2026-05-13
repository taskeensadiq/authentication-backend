import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Role } from 'src/auth/entities/role.entity';
import { Permission } from 'src/auth/entities/permissions.entity';

@Module({
  providers: [SeedService], 
  imports: [ TypeOrmModule.forFeature([ User, Role, Permission ]) ]
})
export class SeedModule {}
