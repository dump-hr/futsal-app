import { Transform } from 'class-transformer';
import {
  IsDate,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  Length,
  Min,
} from 'class-validator';

export class PlayerCreateDto {
  @IsNotEmpty()
  @IsString()
  @Length(2, 20)
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @Length(2, 20)
  lastName: string;

  @IsOptional()
  @Transform(({ value }) => (value ? new Date(value) : null))
  @IsDate()
  dateOfBirth?: Date | null;

  @IsInt()
  @IsOptional()
  @IsPositive()
  teamId?: number;
}

export class PlayerUpdateDto {
  @IsOptional()
  @IsString()
  @Length(2, 20)
  firstName?: string;

  @IsOptional()
  @IsString()
  @Length(2, 20)
  lastName?: string;

  @IsOptional()
  @Transform(({ value }) => (value ? new Date(value) : null))
  @IsDate()
  dateOfBirth?: Date | null;

  @IsInt()
  @IsOptional()
  @IsPositive()
  teamId?: number;
}

export class PlayerDto {
  @IsInt()
  @IsNotEmpty()
  @IsPositive()
  id: number;

  @IsNotEmpty()
  @IsString()
  @Length(2, 20)
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @Length(2, 20)
  lastName: string;

  @IsOptional()
  @Transform(({ value }) => (value ? new Date(value) : null))
  @IsDate()
  dateOfBirth?: Date | null;

  @IsInt()
  @IsOptional()
  @IsPositive()
  teamId?: number | null;

  @IsInt()
  @IsOptional()
  @Min(0)
  goals?: number;
}
