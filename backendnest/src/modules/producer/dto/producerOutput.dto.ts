import { ApiProperty, OmitType } from '@nestjs/swagger';
import { CreateProducerInput } from './producerInput.dto';
import { Role } from 'src/shared/types/role';

export class producerOutput extends OmitType(CreateProducerInput, [
  'password',
] as const) {
  @ApiProperty()
  id_producer: string;

  @ApiProperty({ enum: Role })
  role: Role;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date | null;
}
