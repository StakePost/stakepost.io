import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class Web3Strategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(address: string, signature: string): Promise<any> {
    const user = await this.authService.verifyCredentials({
      address,
      signature,
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
