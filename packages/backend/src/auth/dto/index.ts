import { IsNotEmpty, IsString, IsEthereumAddress } from 'class-validator';

export class CredentialsDto {
  @IsEthereumAddress()
  @IsNotEmpty()
  readonly address: string;
  @IsString()
  @IsNotEmpty()
  readonly signature: string;
}
