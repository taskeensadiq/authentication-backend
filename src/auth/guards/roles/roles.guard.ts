// // import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
// // import { Reflector } from '@nestjs/core';
// // import { Observable } from 'rxjs';
// // import { UserRole } from 'src/auth/entities/user.entity';

// // @Injectable()
// // export class RolesGuard implements CanActivate {
// //   constructor(private reflector: Reflector) {}

// //   canActivate(context: ExecutionContext): boolean {
// //     const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>('roles', [
// //       context.getHandler(),
// //       context.getClass(),
// //     ]);

// //     if (!requiredRoles) return true; 

// //     const { user } = context.switchToHttp().getRequest();

// //     const hasRole = requiredRoles.some((role) => user?.role?.includes(role));
    
// //     if (!hasRole) {
// //       throw new ForbiddenException('You do not have permission to access this resource');
// //     }
    
// //     return true;
// //   }
// // }


// import {
//   CanActivate,
//   ExecutionContext,
//   ForbiddenException,
//   Injectable,
// } from '@nestjs/common';
// import { Reflector } from '@nestjs/core';

// @Injectable()
// export class RolesGuard implements CanActivate {
//   constructor(private reflector: Reflector) {}

//   canActivate(context: ExecutionContext): boolean {
//     const requiredRoles = this.reflector.getAllAndOverride<string[]>(
//       'roles',
//       [context.getHandler(), context.getClass()],
//     );

//     if (!requiredRoles || requiredRoles.length === 0) {
//       return true;
//     }

//     const { user } = context.switchToHttp().getRequest();

//     const userRoles = user?.roles || [];

//     const hasRole = requiredRoles.some(role =>
//       userRoles.includes(role),
//     );

//     if (!hasRole) {
//       throw new ForbiddenException(
//         'You do not have permission to access this resource',
//       );
//     }

//     return true;
//   }
// }