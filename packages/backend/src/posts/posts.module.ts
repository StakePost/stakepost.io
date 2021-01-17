import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './schemas';
import { UsersModule } from 'src/users/users.module';
import { Web3Module } from 'src/web3/web3.module';

@Module({
  imports: [
    UsersModule,
    Web3Module,
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
  ],
  controllers: [PostsController],
  providers: [PostsService],
  exports: [PostsService],
})
export class PostsModule {}
