import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto, PaginationQueryDto, UpdatePostDto } from './dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UsersService } from 'src/users/users.service';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Request() req, @Body() createPostDto: CreatePostDto) {
    const loggedUser = await this.usersService.findByAddress(req.user.address);
    createPostDto.author = loggedUser;
    return this.postsService.create(createPostDto);
  }

  @Get()
  async findAll(@Query() paginationQuery: PaginationQueryDto) {
    return this.postsService.findAll(paginationQuery);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my')
  async findAllUser(
    @Request() req,
    @Query() paginationQuery: PaginationQueryDto,
  ) {
    const loggedUser = await this.usersService.findByAddress(req.user.address);
    return this.postsService.findAllByUser(paginationQuery, loggedUser);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Request() req,
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    const loggedUser = await this.usersService.findByAddress(req.user.address);
    return this.postsService.update(id, updatePostDto, loggedUser);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Request() req, @Param('id') id: string) {
    const loggedUser = await this.usersService.findByAddress(req.user.address);
    return this.postsService.remove(id, loggedUser);
  }
}
