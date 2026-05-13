import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { Role } from './entities/role.entity';
import { Permission } from './entities/permissions.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Role)
    private roleRepository: Repository<Role>,

    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,

    private jwtService: JwtService,
  ) { }

  // async onModuleInit() {
  //   await this.seedRolesAndPermissions();
  //   await this.seedUser();
  // }

//   async seedRolesAndPermissions() {
//     const permissionNames = [
//       'product:create',
//       'product:read',
//       'product:update',
//       'product:archive',
//       'product:delete',
//       'role:create'
//     ];

//     const permissions: Permission[] = [];

//     for (const name of permissionNames) {
//       let permission = await this.permissionRepository.findOne({ where: { name } });

//       if (!permission) {
//         permission = this.permissionRepository.create({ name });
//         await this.permissionRepository.save(permission);
//       }

//       permissions.push(permission);
//     }

//     const getPermissions = (names: string[]) =>
//       permissions.filter(p => names.includes(p.name));

//     const rolesData = [
//       {
//         name: 'ADMIN',
//         permissions: permissionNames,
//       },
//       {
//         name: 'EDITOR',
//         permissions: ['product:create', 'product:read', 'product:update'],
//       },
//       {
//         name: 'USER',
//         permissions: ['product:read'],
//       },
//     ];

    



// for (const roleData of rolesData) {
//   let role = await this.roleRepository.findOne({
//     where: { name: roleData.name },
//     relations: ['permissions'],
//   });

//   const rolePermissions = getPermissions(roleData.permissions);

//   if (!role) {
//     role = this.roleRepository.create({
//       name: roleData.name,
//       permissions: rolePermissions,
//     });
//   } else {
//     role.permissions = rolePermissions;
//   }

//   await this.roleRepository.save(role);
// }

    
//     // for (const roleData of rolesData) {
//     //   let role = await this.roleRepository.findOne({
//     //     where: { name: roleData.name },
//     //     relations: ['permissions'],
//     //   });

//     //   if (!role) {
//     //     role = this.roleRepository.create({
//     //       name: roleData.name,
//     //       permissions: getPermissions(roleData.permissions),
//     //     });

//     //     await this.roleRepository.save(role);
//     //   }
//     // }

//     console.log('Roles & Permissions seeded');
//   }

  // async seedUser() {
  //   const adminEmail = 'demo@example.com';

  //   const userExists = await this.userRepository.findOne({
  //     where: { email: adminEmail },
  //   });

  //   if (!userExists) {
  //     const hashedPassword = await bcrypt.hash('demo123', 10);

  //     const adminRole = await this.roleRepository.findOne({
  //       where: { name: 'ADMIN' },
  //       relations: ['permissions'],
  //     });

  //     const newUser = this.userRepository.create({
  //       email: adminEmail,
  //       password: hashedPassword,
  //       roles: adminRole ? [adminRole] : [],
  //     });

  //     await this.userRepository.save(newUser);

  //     console.log('Default ADMIN user created');
  //   }
  // }

  async login(userDto: any) {
    const user = await this.userRepository.findOne({
      where: { email: userDto.email },
      relations: ['roles', 'roles.permissions'],
    });

    if (!user || !(await bcrypt.compare(userDto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // roles (names only)
    const roles = user.roles.map(r => r.name);

    // permissions (FROM DB RELATIONS)
    const permissions = [
      ...new Set(
        user.roles.flatMap(role =>
          role.permissions.map(p => p.name),
        ),
      ),
    ];

    return {
      access_token: this.jwtService.sign({
        sub: user.id,
        email: user.email,
        roles: user.roles.map(r => r.name),
        permissions,
      }),
      user: {
        id: user.id,
        email: user.email,
        roles,
        permissions,
      },
    };
  }

  // async updateRoles(userId: string, roleIds: string[]) {
  //   const user = await this.userRepository.findOne({
  //     where: { id: userId },
  //     relations: ['roles', 'roles.permissions'],
  //   });

  //   if (!user) throw new UnauthorizedException('User not found');

  //   const roles = await this.roleRepository.find({
  //     where: roleIds.map(id => ({ id })),
  //     relations: ['permissions'],
  //   });

  //   user.roles = roles;
  //   await this.userRepository.save(user);

  //   const permissions = [
  //     ...new Set(
  //       roles.flatMap(role =>
  //         role.permissions.map(p => p.name),
  //       ),
  //     ),
  //   ];

  //   return {
  //     access_token: this.jwtService.sign({
  //       sub: user.id,
  //       email: user.email,
  //       roles: roles.map(r => r.name),
  //       permissions,
  //     }),
  //     user: {
  //       id: user.id,
  //       email: user.email,
  //       roles: roles.map(r => r.name),
  //       permissions,
  //     },
  //   };
  // }

  async register(registerDto: any) {

    const { email, password, role } = registerDto;
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (role === 'SUPERADMIN') {
  throw new UnauthorizedException('Cannot assign SUPERADMIN');
}

    if (existingUser) {
      throw new UnauthorizedException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(
      password,
      10,
    );

    const selectedRole = await this.roleRepository.findOne({
    where: { name: role },   
    relations: ['permissions'],
  });

  if (!selectedRole) {
    throw new UnauthorizedException('Invalid role selected');
  }

    const newUser = this.userRepository.create({
      email: email,
      password: hashedPassword,
      // roles: [], 
      roles: [selectedRole],

    });

    await this.userRepository.save(newUser);

    return {
      message: 'User registered successfully',
      user: {
        id: newUser.id,
        email: newUser.email,
        // roles: [],
        roles: [selectedRole.name],
      },
    };
  }

  async getCurrentUser(userId: string) {
  const user = await this.userRepository.findOne({
    where: { id: userId },
    relations: ['roles', 'roles.permissions'],
  });

  if (!user) throw new UnauthorizedException();

  const roles = user.roles.map(r => r.name);

  const permissions = [
    ...new Set(
      user.roles.flatMap(role =>
        role.permissions.map(p => p.name),
      ),
    ),
  ];

  return {
    id: user.id,
    email: user.email,
    roles,
    permissions,
  };
}
}