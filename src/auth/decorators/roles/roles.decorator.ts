import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/auth/entities/auth.entity';

export const Roles = (...args: UserRole[]) => SetMetadata('roles', args);
