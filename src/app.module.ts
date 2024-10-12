import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { ArtistsController } from './artists/artists.controller';
import { AuthService } from './auth/auth.service';
import { LocalStrategy } from './auth/local.strategy';
import { Albums, AlbumsSchema } from './schemas/albums.schema';
import { Artists, ArtistsSchema } from './schemas/artists.schema';
import { AlbumsController } from './albums/albums.controller';
import { Tracks, TracksSchema } from './schemas/tracks.schema';
import { User, UserSchema } from './schemas/user.schema';
import { TracksController } from './tracks/tracks.controller';
import { UsersController } from './users/users.controller';
import { UniqueUserEmailConstraint } from './users/validators/unique-user-email.validator';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/spotify-nest'),
    MongooseModule.forFeature([
      { name: Artists.name, schema: ArtistsSchema },
      { name: Albums.name, schema: AlbumsSchema },
      { name: Tracks.name, schema: TracksSchema },
      { name: User.name, schema: UserSchema },
    ]),
    PassportModule,
  ],
  controllers: [
    ArtistsController,
    AlbumsController,
    TracksController,
    UsersController,
  ],
  providers: [AuthService, LocalStrategy, UniqueUserEmailConstraint],
})
export class AppModule {}
