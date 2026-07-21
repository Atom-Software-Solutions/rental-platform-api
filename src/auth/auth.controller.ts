import { Body, Controller, Get, HttpCode, HttpStatus, Inject, Post, Query } from '@nestjs/common';
import { AuthCreateTenantDto } from './dto/auth-create-tenant.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import type { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(@Inject('AuthService') private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('verify-email')
  async verifyEmail(@Query() query: VerifyEmailDto) {
    return this.authService.verifyEmail(query.token);
  }

  @Post('register/tenant')
  @HttpCode(HttpStatus.CREATED)
  async createTenant(@Body() createTenantDto: AuthCreateTenantDto) {
    return this.authService.createTenant(createTenantDto);
  }
}
