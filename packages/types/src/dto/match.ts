import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

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
  homeTeam?: { id: number; name: string; logoUrl?: string };

  @IsOptional()
  awayTeam?: { id: number; name: string; logoUrl?: string };
}
