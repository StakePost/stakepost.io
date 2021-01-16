import { PartialType } from '@nestjs/mapped-types';
import {
  IsEthereumAddress,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEthereumAddress()
  address: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  readonly refreshToken: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
