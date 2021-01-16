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
import { AuthService } from './auth.service';
import { CredentialsDto } from './dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @Post('signin')
  async signin(@Body() credentials: CredentialsDto): Promise<User> {
    return this.authService.verifyCredentials(credentials);
  }

  @Get('nonce/:address')
  async nonce(@Param('address') address: string): Promise<string> {
    return this.usersService.findNonceByAddress(address);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Request() req) {
    return req.user;
  }
}
