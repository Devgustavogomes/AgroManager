import { ConfigService } from "@nestjs/config";
import Redis from "ioredis";
import { PinoLogger } from "nestjs-pino";

export const redisProvider = {
  provide: "REDIS_CLIENT",
  inject: [ConfigService, PinoLogger],
  useFactory: (configService: ConfigService, logger: PinoLogger) => {
    logger.setContext("redis-provider");

    const client = new Redis({
      username: configService.get<string>("REDIS_USERNAME"),
      password: configService.get<string>("REDIS_PASSWORD"),
      port: Number(configService.get<string>("REDIS_PORT")),
      host: configService.get<string>("REDIS_HOST"),
      tls: configService.get<string>("REDIS_SSL") === "true" ? {} : undefined,
      retryStrategy: (times) => Math.min(times * 50, 2000),
      enableReadyCheck: true,
    });

    client.on("connect", () => logger.info("[Redis] connected!"));
    client.on("ready", () => logger.info("[Redis] Ready for commands!"));
    client.on("error", (err) => logger.error("[Redis] Error:", err));
    client.on("reconnecting", () => logger.warn("[Redis] Reconnecting..."));

    return client;
  },
};
