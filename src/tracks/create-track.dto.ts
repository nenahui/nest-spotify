import { ApiProperty } from '@nestjs/swagger';

export class CreateTrackDto {
  @ApiProperty()
  album: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  duration: string | null;
}
