import { Module } from '@nestjs/common';
import { ProducerModule } from './producer/producer.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { envSchema } from './config/dto/env.dto';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [configuration],
      validate: (env) => envSchema.parse(env),
    }),
    ProducerModule,
    DatabaseModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
