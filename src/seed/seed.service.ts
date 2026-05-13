import { Injectable } from '@nestjs/common';
import { Permission } from 'src/auth/entities/permissions.entity';
import { Role } from 'src/auth/entities/role.entity';
import { User } from 'src/auth/entities/user.entity';
import { In, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SeedService {

    constructor(
        @InjectRepository(User)
        private userRepo: Repository<User>,
        @InjectRepository(Role)
        private roleRepo: Repository<Role>,
        @InjectRepository(Permission)
        private permissionRepo: Repository<Permission>
    ) { }

    async onModuleInit() {
        await this.seedPermissions();
        await this.seedRoles();
        await this.seedSuperAdmin();
    }

    async seedPermissions() {
        const permissionNames = [
            'product:create',
            'product:read',
            'product:update',
            'product:archive',
            'product:delete',
            'role:create',
            'role:update',
            'role:archive',
            'role:delete',
        ];

        const permissions: Permission[] = [];

        for (const name of permissionNames) {
            let perm = await this.permissionRepo.findOne({ where: { name } });

            if (!perm) {
                perm = this.permissionRepo.create({ name });
                await this.permissionRepo.save(perm);
            }

            permissions.push(perm);
        }

        return permissions;
    }

    async seedRoles() {
        const permissions = await this.permissionRepo.find();

        const getPermissions = (names: string[]) =>
            permissions.filter(p => names.includes(p.name));

        const rolesData = [
            {
                name: 'SUPER_ADMIN',
                permissions: permissions.map(p => p.name),
            },
            {
                name: 'ADMIN',
                permissions: [
                    'product:create',
                    'product:read',
                    'product:update',
                    'product:archive',
                    'product:delete',
                ],
            },
            {
                name: 'EDITOR',
                permissions: ['product:create', 'product:read', 'product:update'],
            },
            {
                name: 'USER',
                permissions: ['product:read'],
            },
        ];

        for (const roleData of rolesData) {
            let role = await this.roleRepo.findOne({
                where: { name: roleData.name },
                relations: ['permissions'],
            });

            const rolePermissions = getPermissions(roleData.permissions);

            if (!role) {
                role = this.roleRepo.create({
                    name: roleData.name,
                    permissions: rolePermissions,
                });
            } else {
                role.permissions = rolePermissions;
            }

            await this.roleRepo.save(role);
        }
    }

    async seedSuperAdmin() {
        const email = 'superadmin@system.com';

        const exists = await this.userRepo.findOne({ where: { email } });

        if (exists) return;

        const role = await this.roleRepo.findOne({
            where: { name: 'SUPER_ADMIN' },
            relations: ['permissions'],
        });

        const user = this.userRepo.create({
            email,
            password: await bcrypt.hash('superadmin123', 10),
            roles:role? [role] : [],
        });

        await this.userRepo.save(user);
    }
}
