import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
} from 'class-validator';
import { Group } from '../enum';
import { PlayerDto } from './player';

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
  logoUrl: string | null;

  @IsOptional()
  groupId?: number | null;

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
