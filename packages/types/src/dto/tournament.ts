import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { TeamDto } from './team';
import { Type } from 'class-transformer';

export class TournamentModifyDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}

export class TournamentDto {
  @IsInt()
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TeamDto)
  teams: TeamDto[];
}
