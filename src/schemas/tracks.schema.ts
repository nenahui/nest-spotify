import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import type { Albums } from './albums.schema';

export type TracksDocument = Tracks & Document;

@Schema()
export class Tracks {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Albums' })
  album: Albums;

  @Prop({ required: true })
  name: string;

  @Prop()
  duration: string;
}

export const TracksSchema = SchemaFactory.createForClass(Tracks);
