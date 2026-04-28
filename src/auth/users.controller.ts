import { Body, Controller, Patch, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UserRole } from './entities/auth.entity';

@Controller('auth')
export class UsersController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('jwt'))
  @Patch('roles')
  async updateRoles(@Req() req: any, @Body('roles') roles: UserRole[]) {
    return this.authService.updateRoles(req.user.userId, roles);
  }
}