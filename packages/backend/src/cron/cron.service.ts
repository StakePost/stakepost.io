// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ethers } from 'ethers';
import * as moment from 'moment';
import { PostsService } from 'src/posts/posts.service';
import { PostDocument } from 'src/posts/schemas';
import { TwitterService } from 'src/twitter/twitter.service';
import { delIPFSPrefix } from 'src/utils';
import { Web3Service } from 'src/web3/web3.service';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);
  constructor(
    private readonly web3Service: Web3Service,
    private readonly postsService: PostsService,
    private readonly twitterService: TwitterService,
  ) {}

  @Cron(process.env.PUBLISH_CRON_PATTERN)
  async publishPost() {
    this.logger.debug('#publishPost');

    //get all posts for this run
    const posts = await this.postsService.findAllForEpoch();
    this.logger.debug(`Getting top post from the list: [SIZE]=${posts.length}`);

    //get post with max stake
    const topPost = await this.selectTopPost(posts);

    //Top post is found, unpin all, and pin this post
    if (topPost !== undefined) {
      this.logger.debug(`Top post found [ID]=${topPost.id}`);

      await this.postsService.unpinAll();
      await this.postsService.pin(topPost.id);
      //await this.twitterService.tweet(topPost);

      this.logger.debug(`Pinning top post to mongo and twitter`);
    } else {
      this.logger.debug(`Top post NOT FOUND`);
    }
  }

  async selectTopPost(
    posts: PostDocument[],
  ): Promise<PostDocument | undefined> {
    for (const post of posts) {
      if (await this.isValidPost(post)) {
        return post;
      }
    }
    return undefined;
  }

  async isValidPost(post: PostDocument): Promise<boolean> {
    const fromTime = moment().startOf('hour').subtract(2, 'hours');

    this.logger.debug(`Validating post with blockchain data [ID]=${post.id}`);

    const web3Post = await this.web3Service.getPostByUser(post.author.address);

    if (
      web3Post !== undefined &&
      web3Post.post === post.hash &&
      web3Post.stake === post.stake &&
      web3Post.user === post.author.address &&
      moment(web3Post.time).isSameOrAfter(fromTime)
    ) {
      this.logger.debug(`VALID post`);
      return true;
    }
    this.logger.debug(`INVALID post`);

    return false;
  }
}
