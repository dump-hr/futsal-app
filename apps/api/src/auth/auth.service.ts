import { JwtResponseDto, LoginDto } from '@futsal-app/types';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { prisma } from '../../lib/prisma';

@Injectable()
export class AuthService {
  private static readonly INVALID_CREDENTIALS_MESSAGE =
    'Pogrešno korisničko ime ili lozinka';

  constructor(private jwtService: JwtService) {}

  async adminLogin(dto: LoginDto): Promise<JwtResponseDto> {
    const admin = await prisma.admin.findFirst({
      where: { username: dto.username },
    });

    if (!admin)
      throw new UnauthorizedException(AuthService.INVALID_CREDENTIALS_MESSAGE);

    const passwordMatches = await bcrypt.compare(dto.password, admin.password);
    if (!passwordMatches)
      throw new UnauthorizedException(AuthService.INVALID_CREDENTIALS_MESSAGE);

    return {
      accessToken: this.jwtService.sign({
        sub: admin.id,
        username: admin.username,
      }),
    };
  }
}
