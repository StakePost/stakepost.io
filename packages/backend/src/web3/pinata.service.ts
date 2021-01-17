import { HttpService, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';
import { CreatePostDto, UpdatePostDto } from 'src/posts/dto';
import { Post } from 'src/posts/schemas';
import { PinataResponse } from './types';

@Injectable()
export class PinataService {
  private readonly logger = new Logger(PinataService.name);
  private baseUrl;
  private key;
  private secret;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.baseUrl = configService.get('PINATA_GATEWAY_URI');
    this.key = configService.get('PINATA_KEY');
    this.secret = configService.get('PINATA_SECRET');
  }

  async pin(
    post: CreatePostDto | UpdatePostDto,
    address: string,
  ): Promise<PinataResponse> {
    const endpoint = `${this.baseUrl}/pinning/pinJSONToIPFS`;
    const now = Date.now();

    const payload = {
      pinataMetadata: {
        name: `Stakepost message from ${address} at ${now}`,
      },
      pinataContent: {
        message: post.content,
        author: address,
        stake: post.stake,
      },
    };
    const options = {
      headers: {
        pinata_api_key: this.key,
        pinata_secret_api_key: this.secret,
      },
    };

    const response = await this.httpService
      .post(endpoint, payload, options)
      .toPromise();

    return Promise.resolve(response.data);
  }

  async unpin(hash: string): Promise<PinataResponse> {
    const endpoint = `${this.baseUrl}/pinning/unpin/${hash}`;

    const options = {
      headers: {
        pinata_api_key: this.key,
        pinata_secret_api_key: this.secret,
      },
    };

    const response = await this.httpService
      .delete(endpoint, options)
      .toPromise();

    return Promise.resolve(response.data);
  }
}
