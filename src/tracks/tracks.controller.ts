import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import { Tracks, type TracksDocument } from '../schemas/tracks.schema';
import type { CreateTrackDto } from './create-track.dto';

@Controller('tracks')
export class TracksController {
  constructor(
    @InjectModel(Tracks.name) private tracksModel: Model<TracksDocument>,
  ) {}

  @Get()
  async getTracks() {
    return this.tracksModel.find();
  }

  @Post()
  async createTrack(@Body() tracksDto: CreateTrackDto) {
    const { album, name, duration } = tracksDto;

    if (!album) {
      throw new BadRequestException('Album is required');
    }
    if (!name) {
      throw new BadRequestException('Name is required');
    }

    return await this.tracksModel.create({
      album,
      name,
      duration,
    });
  }
}
