import { UnprocessableEntityException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { TokenExpiredError } from 'jsonwebtoken';

import { User } from 'src/users/schemas';
import { UsersService } from 'src/users/users.service';

export interface TokenPayload {
  sub: string;
}

@Injectable()
export class TokensService {
  public constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  public async generateAccessToken(user: User): Promise<string> {
    const payload: TokenPayload = {
      sub: user.address,
    };
    return this.jwtService.signAsync(payload, this.getAccessTokenOptions());
  }

  public async generateRefreshToken(user: User): Promise<string> {
    const payload: TokenPayload = {
      sub: user.address,
    };
    return this.jwtService.signAsync(payload, this.getRefreshTokenOptions());
  }

  public async verifyRefreshToken(refresh: string): Promise<User> {
    const payload = await this.decodeRefreshToken(refresh);

    const userByAddress = await this.usersService.findByAddress(payload.sub);
    const userByToken = await this.usersService.findByRefreshToken(refresh);

    if (
      !userByAddress ||
      !userByToken ||
      userByAddress.address !== userByToken.address
    ) {
      throw new UnprocessableEntityException('Refresh token malformed');
    }

    return userByAddress;
  }

  public async createAccessTokenFromRefreshToken(
    refresh: string,
  ): Promise<{ token: string; user: User }> {
    const user = await this.verifyRefreshToken(refresh);
    const token = await this.generateAccessToken(user);

    return { user, token };
  }

  private decodeRefreshToken(token: string): Promise<TokenPayload> {
    try {
      return this.jwtService.verifyAsync(token, {
        secret: this.configService.get('REFRESH_TOKEN_SECRET'),
      });
    } catch (e) {
      if (e instanceof TokenExpiredError) {
        throw new UnprocessableEntityException('Refresh token expired');
      } else {
        throw new UnprocessableEntityException('Refresh token malformed');
      }
    }
  }

  private getBaseTokenOptions(): JwtSignOptions {
    return {
      issuer: this.configService.get('JWT_ISSUER'),
      audience: this.configService.get('JWT_AUDIENCE'),
    };
  }

  private getAccessTokenOptions(): JwtSignOptions {
    return {
      ...this.getBaseTokenOptions(),
      secret: this.configService.get('JWT_TOKEN_SECRET'),
      expiresIn: this.configService.get('JWT_TOKEN_EXPIRES_IN'),
    };
  }

  private getRefreshTokenOptions(): JwtSignOptions {
    return {
      ...this.getBaseTokenOptions(),
      secret: this.configService.get('REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.get('REFRESH_TOKEN_EXPIRES_IN'),
    };
  }
}
