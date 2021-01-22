import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Post } from 'src/posts/schemas';
import * as Twitter from 'twitter';

@Injectable()
export class TwitterService {
  private readonly logger = new Logger(TwitterService.name);
  private client;

  constructor(private readonly configService: ConfigService) {
    this.client = new Twitter({
      consumer_key: configService.get('TWITTER_CONSUMER_KEY'),
      consumer_secret: configService.get('TWITTER_CONSUMER_SECRET'),
      access_token_key: configService.get('TWITTER_ACCESS_TOKEN'),
      access_token_secret: configService.get('TWITTER_ACCESS_SECRET'),
    });
  }

  async tweet(post: Post): Promise<any> {
    const response = await this.client.post('statuses/update', {
      status: post.content,
    });
    console.log(response);

    return Promise.resolve(response.data);
  }
}
