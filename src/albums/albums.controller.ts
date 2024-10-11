import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Model } from 'mongoose';
import { Albums, type AlbumDocument } from '../schemas/albums.schema';
import type { CreateAlbumDto } from './create-album.dto';

@Controller('albums')
export class AlbumsController {
  constructor(
    @InjectModel(Albums.name) private albumModel: Model<AlbumDocument>,
  ) {}

  @Get()
  async getAlbums() {
    return this.albumModel.find();
  }

  @Post()
  @UseInterceptors(FileInterceptor('image', { dest: './public/images' }))
  async createAlbum(
    @Body() albumDto: CreateAlbumDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.albumModel.create({
      artist: albumDto.artist,
      name: albumDto.name,
      release: albumDto.release,
      image: file ? file.filename : null,
    });
  }
}
