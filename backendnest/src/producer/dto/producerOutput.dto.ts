import { ProducerDTO } from './producer.dto';

export type producerOutput = Omit<ProducerDTO, 'password'> & { id: string };
