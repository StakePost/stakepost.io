import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ethers } from 'ethers';
import { addIPFSPrefix } from 'src/utils';
import { ContractPost } from './types';
@Injectable()
export class Web3Service {
  private _infuraKey: string;
  private _network: string;
  private _instance: ethers.Contract;
  private _instanceAddress: string;
  private _instanceAbi: string;
  private _provider: ethers.providers.BaseProvider;

  private _connected = false;

  constructor(private readonly configService: ConfigService) {
    this._infuraKey = configService.get('INFURA_PROJECT_ID');
    this._network = configService.get('WEB3_NETWORK');
    this._instanceAddress = configService.get('CONTRACT_STAKEPOST_ADDRESS');
    this._instanceAbi = configService.get('CONTRACT_STAKEPOST_ABI');
  }

  async connect() {
    this._provider = ethers.getDefaultProvider(this._network, {
      infura: this._infuraKey,
    });

    this._instance = new ethers.Contract(
      this._instanceAddress,
      this._instanceAbi,
      this._provider,
    );

    this._connected = true;
  }

  async getPostByUser(address: string): Promise<ContractPost | undefined> {
    if (!this._connected) {
      await this.connect();
    }

    try {
      const postId = await this._instance.getStakepostIndexByUser(address);
      const post = await this._instance.posts(postId);

      const hash = ethers.utils.base58.encode(addIPFSPrefix(post.post));
      const stake = Number(ethers.utils.formatEther(post.stake));
      const userAddress = post.user;
      const time = new Date(Number(post.time.toString()) * 1000);

      return {
        user: userAddress,
        stake: stake,
        post: hash,
        time: time,
      };
    } catch (e) {
      console.log('Error');
    }

    return undefined;
  }

  async getPosts() {
    if (!this._connected) {
      await this.connect();
    }

    try {
      const data0 = await this._instance.posts(0);

      console.log(ethers.utils.base58.encode(addIPFSPrefix(data0.post)));
      //   const hash = addIPFSPrefix(
      //     ethers.utils.hexlify(),
      //   );

      console.log(data0);
      console.log(data0.user);
      console.log(ethers.utils.formatEther(data0.stake));
      console.log(data0.post);
      //console.log(hash);
      console.log(data0.time);

      const data1 = await this._instance.posts(1);
      console.log(data1);
    } catch (e) {
      console.log('Error');
    }
  }
}
