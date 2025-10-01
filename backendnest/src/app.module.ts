import { Module } from '@nestjs/common';
import { EnvModule } from './config/config.module';
import { UserModule } from './user/user.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [EnvModule, UserModule, DatabaseModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
