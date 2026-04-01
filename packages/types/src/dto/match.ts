import {
  IsArray,
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
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

  @IsDate()
  @IsNotEmpty()
  timeOfMatch: Date;

  @IsInt()
  @IsNotEmpty()
  homeGoals: number;

  @IsInt()
  @IsNotEmpty()
  awayGoals: number;

  @IsEnum(MatchType)
  @IsNotEmpty()
  matchType: `${MatchType}`;

  @IsOptional()
  homeTeam: MatchTeamDto | null;

  @IsOptional()
  awayTeam: MatchTeamDto | null;
}

export class MatchListTeamDto {
  @IsInt()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  logoUrl: string | null;
}

export class MatchListDto {
  @IsInt()
  @IsNotEmpty()
  id: number;

  @IsDate()
  @IsNotEmpty()
  timeOfMatch: Date;

  @IsInt()
  @IsNotEmpty()
  homeGoals: number;

  @IsInt()
  @IsNotEmpty()
  awayGoals: number;

  @IsEnum(MatchType)
  @IsNotEmpty()
  matchType: `${MatchType}`;

  @IsOptional()
  homeTeam: MatchListTeamDto | null;

  @IsOptional()
  awayTeam: MatchListTeamDto | null;
}

export class MatchCreateDto {
  @IsDate()
  @IsNotEmpty()
  timeOfMatch: Date;

  @IsInt()
  @IsNotEmpty()
  homeTeamId: number;

  @IsInt()
  @IsNotEmpty()
  awayTeamId: number;

  @IsEnum(MatchType)
  @IsNotEmpty()
  matchType: `${MatchType}`;
}

export class MatchUpdateDto {
  @IsDate()
  @IsOptional()
  timeOfMatch?: Date;

  @IsEnum(MatchType)
  @IsOptional()
  matchType?: `${MatchType}`;
}
