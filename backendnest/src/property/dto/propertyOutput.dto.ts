import { ApiProperty } from '@nestjs/swagger';
import { CreatePropertyInputDto } from './propertyInput.dto';

export class PropertyOutputDto extends CreatePropertyInputDto {
  @ApiProperty()
  idProperty: string;

  @ApiProperty()
  idProducer: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date | null;
}
