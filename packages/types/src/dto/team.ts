import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
  Length,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
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
  @Min(0)
  numberOfPlayers?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  numberOfMatchesPlayed?: number;

  @IsOptional()
  @IsInt()
  teamScore?: number;

  @IsOptional()
  @IsInt()
  goalDifference?: number;

  @IsOptional()
  players?: PlayerDto[];
}

export class PlayerSyncDto {
  @IsOptional()
  @IsInt()
  @IsPositive()
  id?: number;

  @IsNotEmpty()
  @IsString()
  @Length(2, 20)
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @Length(2, 20)
  lastName: string;
}

export class TeamPlayersSyncDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PlayerSyncDto)
  players: PlayerSyncDto[];
}
