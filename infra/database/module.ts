import { Global, Module } from "@nestjs/common";
import { DatabaseClientProvider } from "./provider";
import { DatabaseService } from "./service";
import { DatabaseContract } from "./contract";

@Global()
@Module({
  providers: [
    DatabaseClientProvider,
    { provide: DatabaseContract, useClass: DatabaseService },
  ],
  exports: [DatabaseContract],
})
export class DatabaseModule {}
