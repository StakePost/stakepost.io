import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto';
import { User } from 'src/users/schemas';
import { UsersService } from 'src/users/users.service';
import { toChecksum } from 'src/utils';
import { AuthService } from './auth.service';
import {
  AuthenticationPayload,
  SigninRequestsDto,
  RefreshRequestDto,
} from './dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { TokensService } from './token.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly tokenService: TokensService,
  ) {}

  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('signin')
  async signin(@Body() credentials: SigninRequestsDto) {
    const user = await this.authService.verifyCredentials(credentials);
    const token = await this.tokenService.generateAccessToken(user);
    const refresh = await this.tokenService.generateRefreshToken(user);

    await this.usersService.updateAfterLogin(user.address, refresh);

    const payload = this.buildResponsePayload(user, token, refresh);
    return {
      status: 'success',
      data: payload,
    };
  }

  @Post('refresh')
  public async refresh(@Body() body: RefreshRequestDto) {
    const {
      user,
      token,
    } = await this.tokenService.createAccessTokenFromRefreshToken(
      body.refresh_token,
    );

    //await this.usersService.updateAfterLogin(user.address, token);

    const payload = this.buildResponsePayload(user, token);

    return {
      status: 'success',
      data: payload,
    };
  }

  @Get('nonce/:address')
  async nonce(@Param('address') address: string) {
    const nonce = await this.usersService.findNonceByAddress(
      toChecksum(address),
    );
    return { address, nonce };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Request() req) {
    return req.user;
  }

  private buildResponsePayload(
    user: User,
    accessToken: string,
    refreshToken?: string,
  ): AuthenticationPayload {
    return {
      user: user,
      payload: {
        type: 'bearer',
        token: accessToken,
        ...(refreshToken ? { refresh_token: refreshToken } : {}),
      },
    };
  }
}
