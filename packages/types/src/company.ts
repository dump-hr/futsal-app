import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Group } from './enum';

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
