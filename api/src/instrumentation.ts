/*instrumentation.ts*/
import * as dotenv from 'dotenv';
import * as path from 'path';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { ConsoleSpanExporter } from '@opentelemetry/sdk-trace-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import {
  PeriodicExportingMetricReader,
  ConsoleMetricExporter,
} from '@opentelemetry/sdk-metrics';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions';

const envFile = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env';
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

const traceExporter = process.env.OTEL_EXPORTER_OTLP_ENDPOINT
  ? new OTLPTraceExporter()
  : new ConsoleSpanExporter();

const metricReader = process.env.OTEL_EXPORTER_OTLP_ENDPOINT
  ? new PeriodicExportingMetricReader({
      exporter: new OTLPMetricExporter(),
    })
  : new PeriodicExportingMetricReader({
      exporter: new ConsoleMetricExporter(),
    });

const sdk = new NodeSDK({
  resource: resourceFromAttributes({
    [ATTR_SERVICE_NAME]: 'agromanager-api',
  }),
  traceExporter: traceExporter,
  metricReader: metricReader,
  instrumentations: [
    getNodeAutoInstrumentations({
      '@opentelemetry/instrumentation-pino': {
        enabled: false,
      },
    }),
  ],
});

sdk.start();
