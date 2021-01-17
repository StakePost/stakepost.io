import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/users/schemas';
import {
  CreatePostDto,
  PaginatedPostsResultDto,
  PaginationQueryDto,
  UpdatePostDto,
} from './dto';
import { Post, PostDocument } from './schemas';

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {}

  async create(createPostDto: CreatePostDto): Promise<Post> {
    const createdPost = new this.postModel(createPostDto);
    return createdPost.save();
  }

  async findAll(
    paginationQuery: PaginationQueryDto,
  ): Promise<PaginatedPostsResultDto> {
    let { limit, offset } = paginationQuery;

    limit = limit || 10;
    offset = offset || 0;
    console.log('Limit', limit);
    const count = await this.postModel.estimatedDocumentCount();
    const posts = await this.postModel
      .find()
      .skip(Number(offset))
      .limit(Number(limit))
      .populate('author', 'address', User.name)
      .exec();
    return {
      count,
      offset: offset,
      limit: limit,
      data: posts,
    };
  }

  async findAllByUser(
    paginationQuery: PaginationQueryDto,
    user: User,
  ): Promise<PaginatedPostsResultDto> {
    let { limit, offset } = paginationQuery;

    limit = limit || 10;
    offset = offset || 0;
    console.log('Limit', limit);
    const count = await this.postModel.countDocuments({ author: user });
    const posts = await this.postModel
      .find({ author: user })
      .skip(Number(offset))
      .limit(Number(limit))
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
      throw new NotFoundException(`Post #${id} not found`);
    }

    return post;
  }

  async update(
    id: string,
    updatePostDto: UpdatePostDto,
    user: User,
  ): Promise<Post> {
    const existingPost = await this.postModel.findOneAndUpdate(
      {
        _id: id,
        author: user,
      },
      updatePostDto,
    );

    if (!existingPost) {
      throw new NotFoundException(`Post #${id} not found`);
    }

    return existingPost;
  }

  async remove(id: string, user: User): Promise<any> {
    const deletedPost = await this.postModel.findOneAndRemove({
      _id: id,
      author: user,
    });
    if (!deletedPost) {
      throw new NotFoundException(`Post #${id} not found`);
    }
    return deletedPost;
  }
}
