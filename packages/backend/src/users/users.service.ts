import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas';
import { v4 as uuidv4 } from 'uuid';
import { CreateUserDto, UpdateUserDto } from './dto';
import { toChecksum } from 'src/utils';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findByToken(token: string): Promise<User> {
    const user = await this.userModel.findOne({ token: token }).exec();

    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    return Promise.resolve(user);
  }

  async findByRefreshToken(refreshToken: string): Promise<User> {
    const user = await this.userModel
      .findOne({ refreshToken: refreshToken })
      .exec();

    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    return Promise.resolve(user);
  }

  async findByAddress(address: string): Promise<User> {
    const user = await this.userModel
      .findOne({ address: toChecksum(address) })
      .exec();

    if (!user) {
      throw new NotFoundException(`User #${address} not found`);
    }

    return Promise.resolve(user);
  }

  async findNonceByAddress(address: string): Promise<string> {
    const user = await this.userModel
      .findOne({ address: toChecksum(address) })
      .exec();

    if (!user) {
      throw new NotFoundException(`User #${address} not found`);
    }

    if (!user.nonce) {
      user.nonce = uuidv4();
      user.save();
    }

    return Promise.resolve(user.nonce);
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    createUserDto.address = toChecksum(createUserDto.address);
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async update(address: string, updateUserDto: UpdateUserDto): Promise<User> {
    const existingUser = await this.userModel.findByIdAndUpdate(
      { address: toChecksum(address) },
      updateUserDto,
    );

    if (!existingUser) {
      throw new NotFoundException(`User #${address} not found`);
    }

    return existingUser;
  }

  async remove(address: string): Promise<any> {
    const deletedUser = await this.userModel.findByIdAndRemove({
      address: toChecksum(address),
    });
    return deletedUser;
  }
}
