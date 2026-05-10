import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsInt,
  IsNotEmpty,
  IsOptional,
  Min,
} from 'class-validator';

export class MatchTimerSyncDto {
  @IsBoolean()
  @IsNotEmpty()
  isRunning: boolean;

  @IsInt()
  @Min(0)
  accumulatedMs: number;
}

export class MatchTimerStateDto {
  @IsInt()
  @IsNotEmpty()
  matchId: number;

  @IsBoolean()
  @IsNotEmpty()
  isRunning: boolean;

  @IsInt()
  @Min(0)
  accumulatedMs: number;

  @IsOptional()
  @Transform(({ value }) => (value ? new Date(value) : null))
  @IsDate()
  startedAt: Date | null;

  @IsOptional()
  @Transform(({ value }) => (value ? new Date(value) : null))
  @IsDate()
  lastSyncedAt: Date | null;
}
