import { Module } from '@nestjs/common';
import { PostsModule } from 'src/posts/posts.module';
import { Web3Module } from 'src/web3/web3.module';
import { CronService } from './cron.service';

@Module({
  imports: [Web3Module, PostsModule],
  providers: [CronService],
})
export class CronModule {}
