import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { PlayerDto } from './player';

export class MatchTeamDto {
  @IsInt()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  logoUrl: string | null;

  @IsArray()
  players: PlayerDto[];
}

export class MatchDto {
  @IsInt()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  timeOfMatch: string;

  @IsInt()
  @IsNotEmpty()
  homeGoals: number;

  @IsInt()
  @IsNotEmpty()
  awayGoals: number;

  @IsString()
  @IsNotEmpty()
  matchType: string;

  @IsOptional()
  homeTeam: MatchTeamDto | null;

  @IsOptional()
  awayTeam: MatchTeamDto | null;
}
