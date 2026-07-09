import { Global, Module } from "@nestjs/common";
import { redisProvider } from "./provider";
import { RedisService } from "./service";
import { CacheContract } from "./contract";

@Global()
@Module({
  providers: [
    redisProvider,
    { provide: CacheContract, useClass: RedisService },
  ],
  exports: [CacheContract, "REDIS_CLIENT"],
})
export class RedisModule {}
