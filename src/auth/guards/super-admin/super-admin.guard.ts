import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class SuperAdminGuard implements CanActivate {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    console.log('Checking Super Admin Guard for user:', req.user);
    const userId = req.user?.sub;

    if (!userId) {
      throw new ForbiddenException('Unauthorized');
    }

    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['roles'],
    });

    const roles = user?.roles?.map(r => r.name) || [];

    console.log('User Roles:', roles);
    if (!roles.includes('SUPER_ADMIN')) {
      throw new ForbiddenException('Super admin only');
    }

    return true;
  }
}