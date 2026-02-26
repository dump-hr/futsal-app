import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  Min,
} from 'class-validator';
import { EventType } from '../enum';

export class MatchEventCreateDto {
  @IsInt()
  @IsNotEmpty()
  @Min(0)
  minute: number;

  @IsInt()
  @IsNotEmpty()
  @IsPositive()
  matchId: number;

  @IsInt()
  @IsOptional()
  @IsPositive()
  playerId?: number;

  @IsEnum(EventType)
  @IsNotEmpty()
  eventType: EventType;

  @IsBoolean()
  @IsNotEmpty()
  isForHomeTeam: boolean;
}

export class MatchEventUpdateDto {
  @IsInt()
  @IsOptional()
  minute?: number;

  @IsInt()
  @IsOptional()
  playerId?: number;

  @IsEnum(EventType)
  @IsOptional()
  eventType?: EventType;
}

export class MatchEventDto {
  @IsInt()
  @IsNotEmpty()
  id: number;

  @IsInt()
  @IsNotEmpty()
  minute: number;

  @IsInt()
  @IsNotEmpty()
  matchId: number;

  @IsInt()
  @IsOptional()
  playerId?: number;

  @IsEnum(EventType)
  @IsNotEmpty()
  eventType: EventType;

  @IsBoolean()
  @IsNotEmpty()
  isForHomeTeam: boolean;
}
