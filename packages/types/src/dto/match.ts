import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { MatchType } from '../enum';
import { TeamDto } from './team';

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

  @IsBoolean()
  @IsNotEmpty()
  isActive: boolean;

  @IsOptional()
  homeTeam: TeamDto | null;

  @IsOptional()
  awayTeam: TeamDto | null;
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
