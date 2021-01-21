import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsPositive, IsNumber } from 'class-validator';
import { IsNotEmpty, IsString } from 'class-validator';
import { User } from 'src/users/schemas';
import { Post } from '../schemas';

export class CreatePostDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly hash: string;

  @IsString()
  @IsNotEmpty()
  readonly content: string;

  @IsNumber()
  @IsNotEmpty()
  readonly stake: number;

  @IsString()
  @IsNotEmpty()
  readonly txHash: string;

  @IsOptional()
  author: User;
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
