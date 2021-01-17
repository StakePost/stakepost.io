import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from 'src/users/schemas';

export type PostDocument = Post & mongoose.Document;

@Schema({ timestamps: true })
export class Post {
  @Prop()
  hash: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  stake: number;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Author' })
  author: User;

  @Prop()
  pinned: boolean;
}

export const PostSchema = SchemaFactory.createForClass(Post);
