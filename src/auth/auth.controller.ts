

import { Controller, Post, Patch, Body, Req, HttpCode, HttpStatus, UseGuards, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: any) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: any) {
    return this.authService.register(registerDto);
  }

  @Patch('roles')
  @UseGuards(AuthGuard('jwt'))
  async updateRoles(@Req() req: any, @Body('roles') roleIds: string[]) {
    return this.authService.updateRoles(req.user.sub, roleIds);
  }

  @Get('whoami')
  @UseGuards(AuthGuard('jwt'))
  async whoAmI(@Req() req) {
    return this.authService.getCurrentUser(req.user.sub);
  }
}