import { Module } from '@nestjs/common';

import { PostsModule } from './posts/posts.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { CronModule } from './cron/cron.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { Web3Module } from './web3/web3.module';

@Module({
  imports: [
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
  ],
})
export class AppModule {}
