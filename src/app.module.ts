import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArtistsController } from './artists/artists.controller';
import { Artists, ArtistsSchema } from './schemas/artists.schema';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/spotify-nest'),
    MongooseModule.forFeature([{ name: Artists.name, schema: ArtistsSchema }]),
  ],
  controllers: [AppController, ArtistsController],
  providers: [AppService],
})
export class AppModule {}
