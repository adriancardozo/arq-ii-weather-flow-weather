import { NodeSDK } from '@opentelemetry/sdk-node';
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { ATTR_SERVICE_NAME, ATTR_SERVICE_VERSION } from '@opentelemetry/semantic-conventions';
import configuration from '../configuration/configuration';
import { HostMetrics } from '@opentelemetry/host-metrics';
import { metrics } from '@opentelemetry/api';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { defaults, defaultsWithAzureMonitor } from './processors';

const { app, insights } = configuration();

export const exporter = new PrometheusExporter({ preventServerStart: true });

let processors = defaults();
if (insights.connection_string) processors = defaultsWithAzureMonitor();
const { spanProcessors, metricReaders, logRecordProcessors } = processors;

const sdk = new NodeSDK({
  resource: resourceFromAttributes({
    [ATTR_SERVICE_NAME]: app.service_name,
    [ATTR_SERVICE_VERSION]: app.version,
  }),
  spanProcessors,
  metricReaders: [...metricReaders, exporter],
  logRecordProcessors,
  instrumentations: [new HttpInstrumentation()],
});

sdk.start();

const hostMetrics = new HostMetrics({ meterProvider: metrics.getMeterProvider() });

hostMetrics.start();
