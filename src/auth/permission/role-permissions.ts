import { UserRole } from 'src/auth/entities/auth.entity';

export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {

    [UserRole.ADMIN]: ['product:create', 'product:read', 'product:update', 'product:delete'],   
    [UserRole.EDITOR]: ['product:create', 'product:read', 'product:update'],
    [UserRole.USER]: ['product:read'],
};