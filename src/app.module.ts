import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ArtistsController } from './artists/artists.controller';
import { Albums, AlbumsSchema } from './schemas/albums.schema';
import { Artists, ArtistsSchema } from './schemas/artists.schema';
import { AlbumsController } from './albums/albums.controller';
import { Tracks, TracksSchema } from './schemas/tracks.schema';
import { TracksController } from './tracks/tracks.controller';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/spotify-nest'),
    MongooseModule.forFeature([
      { name: Artists.name, schema: ArtistsSchema },
      { name: Albums.name, schema: AlbumsSchema },
      { name: Tracks.name, schema: TracksSchema },
    ]),
  ],
  controllers: [ArtistsController, AlbumsController, TracksController],
})
export class AppModule {}
