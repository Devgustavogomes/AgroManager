import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  HealthCheckResult,
  HealthIndicatorService,
  MemoryHealthIndicator,
  DiskHealthIndicator,
} from '@nestjs/terminus';
import { DatabaseContract } from '@agromanager/infra/database/contract';
import { CacheContract } from '@agromanager/infra/redis/contract';

@Controller('health')
export class AppController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly healthIndicatorService: HealthIndicatorService,
    private readonly databaseService: DatabaseContract,
    private readonly redisService: CacheContract,
    private readonly memory: MemoryHealthIndicator,
    private readonly disk: DiskHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  async check(): Promise<HealthCheckResult> {
    return this.health.check([
      async () => {
        const indicator = this.healthIndicatorService.check('database');
        try {
          await this.databaseService.query('SELECT 1');
          return indicator.up();
        } catch (error: unknown) {
          const message =
            error instanceof Error ? error.message : String(error);
          return indicator.down({ message });
        }
      },
      async () => {
        const indicator = this.healthIndicatorService.check('redis');
        try {
          await this.redisService.get('health_check_ping');
          return indicator.up();
        } catch (error: unknown) {
          const message =
            error instanceof Error ? error.message : String(error);
          return indicator.down({ message });
        }
      },
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
      () =>
        this.disk.checkStorage('disk_space', {
          thresholdPercent: 0.1,
          path: '/',
        }),
    ]);
  }
}
