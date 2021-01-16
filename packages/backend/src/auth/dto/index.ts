import { IsNotEmpty, IsString, IsEthereumAddress } from 'class-validator';
import { User } from 'src/users/schemas';

export class SigninRequestsDto {
  @IsEthereumAddress()
  @IsNotEmpty()
  readonly address: string;
  @IsString()
  @IsNotEmpty()
  readonly signature: string;
}
export class RefreshRequestDto {
  @IsNotEmpty()
  readonly refresh_token: string;
}

export interface AuthenticationPayload {
  user: User;
  payload: {
    type: string;
    token: string;
    refresh_token?: string;
  };
}
