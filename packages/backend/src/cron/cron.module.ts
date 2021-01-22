import { Module } from '@nestjs/common';
import { PostsModule } from 'src/posts/posts.module';
import { TwitterModule } from 'src/twitter/twitter.module';
import { Web3Module } from 'src/web3/web3.module';
import { CronService } from './cron.service';

@Module({
  imports: [Web3Module, PostsModule, TwitterModule],
  providers: [CronService],
})
export class CronModule {}
