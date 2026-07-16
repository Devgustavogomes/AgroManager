import * as dotenv from 'dotenv';
import * as path from 'path';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions';
import { ConsoleSpanExporter } from '@opentelemetry/sdk-trace-node';
import {
  ConsoleMetricExporter,
  PeriodicExportingMetricReader,
} from '@opentelemetry/sdk-metrics';

const envFile = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env';
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

const sdk = new NodeSDK({
  resource: resourceFromAttributes({
    [ATTR_SERVICE_NAME]: 'agromanager-api',
  }),
  traceExporter: process.env.OTEL_EXPORTER_OTLP_ENDPOINT
    ? undefined
    : new ConsoleSpanExporter(),
  metricReaders: process.env.OTEL_EXPORTER_OTLP_ENDPOINT
    ? undefined
    : [
        new PeriodicExportingMetricReader({
          exporter: new ConsoleMetricExporter(),
        }),
      ],
  instrumentations: [
    getNodeAutoInstrumentations({
      '@opentelemetry/instrumentation-pino': {
        enabled: false,
      },
    }),
  ],
});

sdk.start();
