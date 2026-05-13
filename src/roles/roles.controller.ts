import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Get,
  UseGuards,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { AuthGuard } from '@nestjs/passport';
import { use } from 'passport';
import { SuperAdminGuard } from 'src/auth/guards/super-admin/super-admin.guard';

@Controller('roles')
// @UseGuards(AuthGuard('jwt'))
export class RolesController {
  constructor(private readonly rolesService: RolesService) { }

  // GET ALL PERMISSIONS
  @Get('permissions')
  getPermissions() {
    return this.rolesService.getPermissions();
  }

  // CREATE ROLE (ADMIN ONLY)
  // @Post()
  // @UseGuards(AuthGuard('jwt'))
  // async createRole(
  //   @Req() req: any,
  //   @Body('name') name: string,
  //   @Body('permissionIds') permissionIds?: string[],
  // ) {
  //   const userRoles = req.user.role || [];
  //   if (!userRoles.includes('ADMIN')) {
  //     throw new ForbiddenException('Only admins can create roles');
  //   }
  //   return this.rolesService.createRole(name, permissionIds);
  // }

  //   @Post()
  // @UseGuards(AuthGuard('jwt'))
  // async createRole(
  //   @Req() req: any,
  //   @Body('name') name: string,
  //   @Body('permissionIds') permissionIds?: string[],
  // ) {
  //   const permissions = req.user.permissions || [];

  //   if (!permissions.includes('role:create')) {
  //     throw new ForbiddenException('You do not have permission to create roles');
  //   }

  //   return this.rolesService.createRole(name, permissionIds);
  // }

  @Post()
  @UseGuards(AuthGuard('jwt'), SuperAdminGuard)
  async createRole(
    @Req() req: any,
    @Body('name') name: string,
    @Body('permissionIds') permissionIds?: string[],
  ) {
    // const allowed = await this.rolesService.hasPermission(
    //   req.user.sub,
    //   'role:create',
    // );

    // if (!allowed) {
    //   throw new ForbiddenException('You do not have permission to create roles');
    // }

    return this.rolesService.createRole(name, permissionIds);
  }

  // GET ALL ROLES
  @Get()
  @UseGuards(AuthGuard('jwt'))
  getRoles() {
    return this.rolesService.getRoles();
  }

  //   // @UseGuards(AuthGuard('jwt'))
  // @Get()
  // getRoles(@Req() req: any) {
  //   return this.rolesService.getRoles();
  // }
  // ASSIGN PERMISSIONS
  // @Patch(':id/permissions')
  // @UseGuards(AuthGuard('jwt'))
  // assignPermissions(
  //   @Param('id') roleId: string,
  //   @Body('permissionIds') permissionIds: string[],
  // ) {
  //   return this.rolesService.assignPermissions(roleId, permissionIds);
  // }

  @Patch(':id/permissions')
  @UseGuards(AuthGuard('jwt'), SuperAdminGuard)
  async assignPermissions(
    @Req() req: any,
    @Param('id') roleId: string,
    @Body('permissionIds') permissionIds: string[],
  ) {
    // const allowed = await this.rolesService.hasPermission(
    //   req.user.sub,
    //   'role:update',
    // );

    // if (!allowed) {
    //   throw new ForbiddenException();
    // }

    return this.rolesService.assignPermissions(roleId, permissionIds);
  }

  // UPDATE ROLE NAME
  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), SuperAdminGuard)
  updateRole(
    @Param('id') id: string,
    @Body('name') name: string,
  ) {
    return this.rolesService.updateRole(id, name);
  }
}
