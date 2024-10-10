import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { Document } from 'mongoose';

export type ArtistsDocument = Artists & Document;

@Schema()
export class Artists {
  @Prop({ required: true })
  name: string;

  @Prop()
  image: string;

  @Prop()
  information: string;
}

export const ArtistsSchema = SchemaFactory.createForClass(Artists);
