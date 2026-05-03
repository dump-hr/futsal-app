import { JwtResponseDto, LoginDto } from '@futsal-app/types';
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LoginThrottlerGuard } from './login-throttler.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LoginThrottlerGuard)
  @Post('admin/login')
  async adminLogin(@Body() dto: LoginDto): Promise<JwtResponseDto> {
    return this.authService.adminLogin(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('verify')
  verify(): { ok: boolean } {
    return { ok: true };
  }
}
