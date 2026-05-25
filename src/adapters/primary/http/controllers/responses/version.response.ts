import { ApiProperty } from '@nestjs/swagger';

export class VersionResponse {
  @ApiProperty()
  version: string;

  constructor(version: string) {
    this.version = version;
  }
}
