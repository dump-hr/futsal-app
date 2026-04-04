import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
} from 'class-validator';
import { PlayerDto } from './player';
import { GroupDto } from './group';

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
  groupId?: number | null;

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
  @IsInt()
  groupId?: number | null;

  @IsOptional()
  group?: GroupDto | null;

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

  @IsOptional()
  players?: PlayerDto[];
}
