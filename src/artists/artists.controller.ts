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
import type { Express } from 'express';
import { existsSync, mkdirSync } from 'fs';
import type { Model } from 'mongoose';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Artists, type ArtistsDocument } from '../schemas/artists.schema';
import type { CreateArtistDto } from './create-artist.dto';
import { randomUUID } from 'crypto';

@Controller('artists')
export class ArtistsController {
  constructor(
    @InjectModel(Artists.name) private artistModel: Model<ArtistsDocument>,
  ) {}

  @Get()
  async getArtists() {
    return this.artistModel.find();
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: (_req, _file, callback) => {
          const uploadPath = './public/images/artists';

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
  async createArtist(
    @Body() artistsDto: CreateArtistDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const { name, information } = artistsDto;

    if (!name) {
      throw new BadRequestException('Name is required');
    }

    return await this.artistModel.create({
      name,
      information,
      image: file ? `images/artists/${file.filename}` : null,
    });
  }
}
