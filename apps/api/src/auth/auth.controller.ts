import { JwtResponseDto, LoginDto } from '@futsal-app/types';
import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('admin/login')
  async adminLogin(@Body() dto: LoginDto): Promise<JwtResponseDto> {
    return this.authService.adminLogin(dto);
  }
}
