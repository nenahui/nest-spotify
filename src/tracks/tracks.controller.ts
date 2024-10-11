import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, type Model } from 'mongoose';
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

    switch (true) {
      case !album:
        throw new BadRequestException('Album is required');
      case !name:
        throw new BadRequestException('Name is required');
    }

    return await this.tracksModel.create({
      album,
      name,
      duration,
    });
  }

  @Delete(':id')
  async deleteTrack(@Param('id') id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Incorrect ID');
    }

    const track = await this.tracksModel.findByIdAndDelete(id);

    if (!track) {
      throw new BadRequestException('Track not found');
    }

    return 'OK';
  }
}
