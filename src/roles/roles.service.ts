import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Role } from '../auth/entities/role.entity';
import { Permission } from '../auth/entities/permissions.entity';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class RolesService {
  constructor(

    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Role)
    private roleRepository: Repository<Role>,

    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
  ) {}

  // GET ALL PERMISSIONS
  async getPermissions() {
    return this.permissionRepository.find();
  }

  // CREATE ROLE
  async createRole(name: string, permissionIds?: string[]) {

    if (name === 'SUPER_ADMIN') {
    throw new ForbiddenException('Cannot create SUPER_ADMIN role');
  }

    const role = this.roleRepository.create({ name });

    if (permissionIds && permissionIds.length > 0) {
      const permissions = await this.permissionRepository.findBy({
        id: In(permissionIds),
      });
      role.permissions = permissions;
    }

    return this.roleRepository.save(role);
  }

  // GET ALL ROLES
  async getRoles() {
    return this.roleRepository.find({
      relations: ['permissions'],
    });
  }

  // UPDATE ROLE NAME
  async updateRole(id: string, name: string) {
    const role = await this.roleRepository.findOne({ where: { id } });

    if (!role) throw new NotFoundException('Role not found');

    role.name = name;
    return this.roleRepository.save(role);
  }

  // ASSIGN PERMISSIONS
  async assignPermissions(roleId: string, permissionIds: string[]) {
    const role = await this.roleRepository.findOne({
      where: { id: roleId },
      relations: ['permissions'],
    });

    if (!role) throw new NotFoundException('Role not found');

    const permissions = await this.permissionRepository.findBy({
      id: In(permissionIds),
    });

    role.permissions = permissions;

    return this.roleRepository.save(role);
  }

  async hasPermission(userId: string, permission: string) {
  const user = await this.userRepository.findOne({
    where: { id: userId },
    relations: ['roles', 'roles.permissions'],
  });

  const permissions = [
    ...new Set(
      user?.roles.flatMap(role =>
        role.permissions.map(p => p.name),
      ),
    ),
  ];

  return permissions.includes(permission);
}
}