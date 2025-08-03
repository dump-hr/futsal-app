import { Group } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCompanyDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(Group)
  @IsOptional()
  group?: Group;

  @IsString()
  @IsOptional()
  logoUrl?: string;
}
