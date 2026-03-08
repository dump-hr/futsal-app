import {
  IsString,
  IsOptional,
  IsEnum,
  IsInt,
  IsUrl,
  IsNotEmpty,
  IsPositive,
  Length,
} from 'class-validator';
import { Group } from '@prisma/client';

export class CreateTeamDto {
  @IsNotEmpty()
  @IsString()
  @Length(2, 20)
  name: string;

  @IsOptional()
  @IsUrl()
  logoUrl?: string;

  @IsOptional()
  @IsEnum(Group, { message: 'Group must be a valid enum value (A, B, C, D)' })
  group?: Group;

  @IsOptional()
  @IsInt()
  tournamentId?: number;
}

export class UpdateTeamDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Length(2, 20)
  name?: string;

  @IsOptional()
  @IsUrl()
  logoUrl?: string;

  @IsOptional()
  @IsEnum(Group)
  group?: Group;

  @IsOptional()
  @IsInt()
  tournamentId?: number;
}

export class TeamDto {
  @IsInt()
  @IsNotEmpty()
  @IsPositive()
  id: number;

  @IsNotEmpty()
  @IsString()
  @Length(2, 20)
  name: string;

  @IsOptional()
  @IsUrl()
  logoUrl: string | null;

  group: Group | null;

  @IsOptional()
  @IsInt()
  tournamentId: number | null;
}
