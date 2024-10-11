import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FileInterceptor } from '@nestjs/platform-express';
import { randomUUID } from 'crypto';
import type { Model } from 'mongoose';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Albums, type AlbumDocument } from '../schemas/albums.schema';
import type { CreateAlbumDto } from './create-album.dto';
import { existsSync, mkdirSync } from 'fs';

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

    if (!artist) {
      throw new BadRequestException('Artist is required');
    } else if (!name) {
      throw new BadRequestException('Name is required');
    } else if (!release) {
      throw new BadRequestException('Release is required');
    }

    return await this.albumModel.create({
      artist,
      name,
      release,
      image: file ? `images/albums/${file.filename}` : null,
    });
  }
}
