import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';
import { User } from 'src/users/schemas';
import { UsersService } from 'src/users/users.service';
import { toChecksum } from 'src/utils';
import { CredentialsDto } from './dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async verifyCredentials(credentials: CredentialsDto): Promise<User> {
    const address = toChecksum(credentials.address);

    const foundUser = await this.usersService.findByAddress(address);

    if (!foundUser || !foundUser.nonce) {
      throw new NotFoundException(`User #${address} not found`);
    }

    const msg = `${this.configService.get('SIGNIN_MESSAGE')} ${
      foundUser.nonce
    }`;

    const recoveredAddress = toChecksum(
      ethers.utils.verifyMessage(msg, credentials.signature),
    );
    if (address !== recoveredAddress) {
      throw new UnauthorizedException('Invalid signature.');
    }

    return foundUser;
  }

  async login(user: any) {
    const payload = { username: user.address, sub: user.address };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
