import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PostDocument = Post & Document;

@Schema({ timestamps: true })
export class Post {
  @Prop({ required: true })
  user: string;

  @Prop({ required: true })
  hash: string;

  @Prop({ required: true })
  stake: number;

  @Prop({ required: true })
  time: Date;

  @Prop({ required: true })
  content: string;
}

export const PostSchema = SchemaFactory.createForClass(Post);
