import {
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { PlayerDto } from './player';
import { MatchType } from '../enum';

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
  timeOfMatch: Date;

  @IsInt()
  @IsNotEmpty()
  homeGoals: number;

  @IsInt()
  @IsNotEmpty()
  awayGoals: number;

  @IsNotEmpty()
  matchType: `${MatchType}`;

  @IsOptional()
  homeTeam: MatchTeamDto | null;

  @IsOptional()
  awayTeam: MatchTeamDto | null;
}
