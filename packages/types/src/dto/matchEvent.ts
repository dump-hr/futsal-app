import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { EventType } from '../enum';

export class MatchEventCreateDto {
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

export class MatchEventPlayerDto {
  @IsInt()
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;
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

  @IsOptional()
  player?: MatchEventPlayerDto;

  @IsEnum(EventType)
  @IsNotEmpty()
  eventType: EventType;

  @IsBoolean()
  @IsNotEmpty()
  isForHomeTeam: boolean;
}
