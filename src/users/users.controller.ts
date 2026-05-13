import { Body, Controller, Patch, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
import { SuperAdminGuard } from 'src/auth/guards/super-admin/super-admin.guard';

@Controller('auth')
export class UsersController {
  constructor(private usersService : UsersService) {}

  @UseGuards(AuthGuard('jwt'), SuperAdminGuard)
  @Patch('roles')
  async updateRoles(@Req() req: any, @Body('roles') roles: any[]) {
    return this.usersService.updateRoles(req.user.userId, roles);
  }

}