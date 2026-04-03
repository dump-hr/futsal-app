import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
} from 'class-validator';

export class TeamCreateDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsUrl()
  logoUrl?: string;

  @IsOptional()
  @IsInt()
  @IsPositive()
  groupId?: number;

  @IsInt()
  @IsPositive()
  tournamentId: number;
}

export class TeamUpdateDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsUrl()
  logoUrl?: string;

  @IsOptional()
  @IsInt()
  @IsPositive()
  groupId?: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  tournamentId?: number;
}

export class TeamDto {
  @IsInt()
  @IsNotEmpty()
  @IsPositive()
  id: number;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  logoUrl?: string | null;

  @IsOptional()
  groupId?: number | null;

  @IsOptional()
  @IsInt()
  @IsPositive()
  tournamentId?: number | null;
}
