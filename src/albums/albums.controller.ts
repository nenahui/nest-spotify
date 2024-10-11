import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { randomUUID } from 'crypto';
import { isValidObjectId, type Model } from 'mongoose';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Albums, type AlbumDocument } from '../schemas/albums.schema';
import type { CreateAlbumDto } from './create-album.dto';
import { existsSync, mkdirSync } from 'fs';

@ApiTags('albums')
@Controller('albums')
export class AlbumsController {
  constructor(
    @InjectModel(Albums.name) private albumModel: Model<AlbumDocument>,
  ) {}

  @Get()
  async getAlbums(@Query('artist') artist: string) {
    if (artist) {
      if (!isValidObjectId(artist)) {
        throw new BadRequestException('Incorrect ID');
      }

      return this.albumModel.find({ artist });
    }

    return this.albumModel.find();
  }

  @Get(':id')
  async getAlbumById(@Param('id') id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Incorrect ID');
    }

    const album = await this.albumModel.findById(id).populate('artist');

    if (!album) {
      throw new BadRequestException('Album not found');
    }

    return album;
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: (_req, _file, callback) => {
          const uploadPath = './public/images/albums';

          if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath, { recursive: true });
          }

          callback(null, uploadPath);
        },
        filename: (_req, file, callback) => {
          const uniqueName = randomUUID();
          const ext = extname(file.originalname);
          callback(null, uniqueName + ext);
        },
      }),
      fileFilter: (_req, file, callback) => {
        if (file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
          callback(null, true);
        } else {
          callback(
            new BadRequestException(
              'Only JPG, JPEG, and PNG files are allowed',
            ),
            false,
          );
        }
      },
      limits: { fileSize: 1024 * 1024 * 5 },
    }),
  )
  async createAlbum(
    @Body() albumDto: CreateAlbumDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const { artist, name, release } = albumDto;

    switch (true) {
      case !artist:
        throw new BadRequestException('Artist is required');
      case !name:
        throw new BadRequestException('Name is required');
      case !release:
        throw new BadRequestException('Release is required');
    }

    return await this.albumModel.create({
      artist,
      name,
      release,
      image: file ? `images/albums/${file.filename}` : null,
    });
  }

  @Delete(':id')
  async deleteAlbum(@Param('id') id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Incorrect ID');
    }

    const album = await this.albumModel.findByIdAndDelete(id);

    if (!album) {
      throw new BadRequestException('Album not found');
    }

    return 'OK';
  }
}
