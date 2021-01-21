import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as moment from 'moment';
import { Model } from 'mongoose';
import { User } from 'src/users/schemas';
import { PinataService } from 'src/web3/pinata.service';
import { PinataResponse } from 'src/web3/types';
import {
  CreatePostDto,
  PaginatedPostsResultDto,
  PaginationQueryDto,
  UpdatePostDto,
} from './dto';
import { Post, PostDocument } from './schemas';

@Injectable()
export class PostsService {
  constructor(
    private readonly pinataService: PinataService,
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
  ) {}

  async findAll(
    paginationQuery: PaginationQueryDto,
  ): Promise<PaginatedPostsResultDto> {
    let { limit, offset } = paginationQuery;

    limit = Number(limit) || 10;
    offset = Number(offset) || 0;
    const count = await this.postModel.estimatedDocumentCount();
    const posts = await this.postModel
      .find()
      .skip(offset)
      .limit(limit)
      .sort({ pinned: -1, createdAt: -1 })
      .populate('author', 'address', User.name)
      .exec();
    return {
      count,
      offset,
      limit,
      data: posts,
    };
  }

  async findAllForEpoch(): Promise<PostDocument[]> {
    const fromTime = moment().startOf('hour').subtract(2, 'hours');
    return this.postModel
      .find({
        createdAt: {
          $gte: fromTime.toDate(),
        },
      })
      .sort('-stake')
      .populate('author', 'address', User.name)
      .exec();
  }

  async findAllByUser(
    paginationQuery: PaginationQueryDto,
    user: User,
  ): Promise<PaginatedPostsResultDto> {
    let { limit, offset } = paginationQuery;

    limit = Number(limit) || 10;
    offset = Number(offset) || 0;
    const count = await this.postModel.countDocuments({ author: user });
    const posts = await this.postModel
      .find({ author: user })
      .skip(offset)
      .limit(limit)
      .sort({ pinned: -1, createdAt: -1 })
      .populate('author', 'address', User.name)
      .exec();
    return {
      count,
      offset: offset,
      limit: limit,
      data: posts,
    };
  }

  async findOne(id: string): Promise<Post> {
    const post = await this.postModel
      .findById({ _id: id })
      .populate('author', 'address', User.name)
      .exec();

    if (!post) {
      throw new NotFoundException(`Post not found`);
    }

    return post;
  }

  async create(createPostDto: CreatePostDto, user: User): Promise<Post> {
    const createdPost = new this.postModel(createPostDto);
    createdPost.author = user;

    const pinataResponse: PinataResponse = await this.pinataService.pin(
      createPostDto,
      user.address,
    );
    createdPost.hash = pinataResponse.IpfsHash;
    return createdPost.save();
  }

  async update(
    id: string,
    updatePostDto: UpdatePostDto,
    user: User,
  ): Promise<Post> {
    const existingPost = await this.postModel
      .findOne({
        _id: id,
        author: user,
      })
      .populate('author', 'address', User.name);

    if (!existingPost) {
      throw new NotFoundException(`Post not found`);
    }

    if (
      existingPost.content !== updatePostDto.content ||
      existingPost.author.address !== user.address ||
      existingPost.stake !== updatePostDto.stake
    ) {
      await this.pinataService.unpin(existingPost.hash);
      const pinataResponse: PinataResponse = await this.pinataService.pin(
        updatePostDto,
        user.address,
      );
      existingPost.hash = pinataResponse.IpfsHash;
      existingPost.content = updatePostDto.content;
      existingPost.stake = updatePostDto.stake;
    }

    existingPost.save();

    return existingPost;
  }

  async remove(id: string, user: User): Promise<any> {
    const deletedPost = await this.postModel.findOneAndRemove({
      _id: id,
      author: user,
    });

    if (!deletedPost) {
      throw new NotFoundException(`Post not found`);
    }

    await this.pinataService.unpin(deletedPost.hash);

    return deletedPost;
  }

  async pin(id: string): Promise<any> {
    const updated = await this.postModel.findByIdAndUpdate(id, {
      pinned: true,
    });

    return updated;
  }

  async unpinAll(): Promise<any> {
    const updated = await this.postModel
      .updateMany({ pinned: true }, { pinned: false })
      .exec();

    return updated;
  }
}
