import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Express } from 'express';
import { existsSync, mkdirSync } from 'fs';
import { isValidObjectId, type Model } from 'mongoose';
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

  @Get(':id')
  async getArtistById(@Param('id') id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Incorrect ID');
    }

    const artist = await this.artistModel.findById(id);

    if (!artist) {
      throw new BadRequestException('Artist not found');
    }

    return artist;
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

  @Delete(':id')
  async deleteArtist(@Param('id') id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Incorrect ID');
    }

    const artist = await this.artistModel.findByIdAndDelete(id);

    if (!artist) {
      throw new BadRequestException('Artist not found');
    }

    return 'OK';
  }
}
