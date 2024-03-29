import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { PostsModule } from './posts/posts.module';
import { CronModule } from './cron/cron.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { Web3Module } from './web3/web3.module';
import { TwitterModule } from './twitter/twitter.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'frontend', 'build'),
      exclude: ['/api*'],
    }),
    PostsModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('MONGO_URI'),
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      }),
      inject: [ConfigService],
    }),
    CronModule,
    ScheduleModule.forRoot(),
    AuthModule,
    UsersModule,
    Web3Module,
    TwitterModule,
  ],
})
export class AppModule {}
