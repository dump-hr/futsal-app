import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
} from 'class-validator';
import { Group } from '../enum';

export class TeamCreateDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsUrl()
  logoUrl?: string;

  @IsOptional()
  @IsEnum(Group)
  group?: Group;

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
  @IsEnum(Group)
  group?: Group;

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
  group?: `${Group}` | null;

  @IsOptional()
  @IsInt()
  @IsPositive()
  tournamentId?: number | null;

  @IsOptional()
  @IsInt()
  numberOfPlayers?: number;

  @IsOptional()
  @IsInt()
  numberOfMatchesPlayed?: number;

  @IsOptional()
  @IsInt()
  teamScore?: number;
}
