import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsPositive, IsNumber } from 'class-validator';
import { MaxLength, IsNotEmpty, IsEmail, IsString } from 'class-validator';
import { Post } from '../schemas';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  readonly user: string;
  @IsString()
  @IsNotEmpty()
  readonly hash: string;
  @IsNumber()
  @IsNotEmpty()
  readonly stake: number;
  @IsNumber()
  @IsNotEmpty()
  readonly time: Date;
  @IsString()
  @IsNotEmpty()
  readonly content: string;
}

export class UpdatePostDto extends PartialType(CreatePostDto) {}

export class PaginationQueryDto {
  @IsOptional()
  @IsPositive()
  @IsNumber()
  limit: number;

  @IsOptional()
  @IsPositive()
  @IsNumber()
  offset: number;
}

export class PaginatedPostsResultDto {
  data: Post[];
  offset: number;
  limit: number;
  count: number;
}
