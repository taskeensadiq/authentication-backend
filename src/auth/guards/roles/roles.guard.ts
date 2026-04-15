import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { UserRole } from 'src/auth/entities/auth.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. What roles are required for this route?
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) return true; // If no roles defined, allow access

    // 2. Get the user from the request (attached by JwtStrategy)
    const { user } = context.switchToHttp().getRequest();

    // 3. Check if user has the required role
    const hasRole = requiredRoles.some((role) => user?.role === role);
    
    if (!hasRole) {
      throw new ForbiddenException('You do not have permission to access this resource');
    }
    
    return true;
  }
}