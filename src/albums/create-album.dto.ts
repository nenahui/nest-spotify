import { ApiProperty } from '@nestjs/swagger';

export class CreateAlbumDto {
  @ApiProperty()
  artist: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  release: number;

  @ApiProperty()
  image: string | null;
}
