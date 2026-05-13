import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from 'src/auth/entities/permissions.entity';
import { Role } from 'src/auth/entities/role.entity';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Role)
    private roleRepository: Repository<Role>,

    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,

    private jwtService: JwtService,
  ) { }


  async updateRoles(userId: string, roleIds: string[]) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['roles', 'roles.permissions'],
    });

    if (!user) throw new UnauthorizedException('User not found');

    const roles = await this.roleRepository.find({
      where: roleIds.map(id => ({ id })),
      relations: ['permissions'],
    });

    user.roles = roles;
    await this.userRepository.save(user);

    const permissions = [
      ...new Set(
        roles.flatMap(role =>
          role.permissions.map(p => p.name),
        ),
      ),
    ];

    return {
      access_token: this.jwtService.sign({
        sub: user.id,
        email: user.email,
        roles: roles.map(r => r.name),
        permissions,
      }),
      user: {
        id: user.id,
        email: user.email,
        roles: roles.map(r => r.name),
        permissions,
      },
    };
  }

}
